import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { Point } from '../../../maths/Point.mjs';
import { BindGroup } from '../../renderers/gpu/shader/BindGroup.mjs';
import { Geometry } from '../../renderers/shared/geometry/Geometry.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { TexturePool } from '../../renderers/shared/texture/TexturePool.mjs';
import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { getGlobalBounds } from '../../scene/bounds/getGlobalBounds.mjs';
import { getGlobalRenderableBounds } from '../../scene/bounds/getRenderableBounds.mjs';

const quadGeometry = new Geometry({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      shaderLocation: 0,
      format: "float32x2",
      stride: 2 * 4,
      offset: 0
    }
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3])
});
class FilterSystem {
  constructor(renderer) {
    this.filterStackIndex = 0;
    this.filterStack = [];
    this.filterGlobalUniforms = new UniformGroup({
      inputSize: { value: new Float32Array(4), type: "vec4<f32>" },
      inputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
      inputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
      outputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      backgroundFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      globalFrame: { value: new Float32Array(4), type: "vec4<f32>" }
    });
    this.globalFilterBindGroup = new BindGroup({});
    this.renderer = renderer;
  }
  push(instruction) {
    const renderer = this.renderer;
    const filters = instruction.filterEffect.filters;
    if (!this.filterStack[this.filterStackIndex]) {
      this.filterStack[this.filterStackIndex] = this.getFilterData();
    }
    const filterData = this.filterStack[this.filterStackIndex];
    this.filterStackIndex++;
    const bounds = filterData.bounds;
    if (instruction.renderables) {
      getGlobalRenderableBounds(instruction.renderables, bounds);
    } else {
      getGlobalBounds(instruction.container, true, bounds);
    }
    if (filters.length === 0) {
      filterData.skip = true;
      return;
    }
    let resolution = renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution;
    let padding = 0;
    let antialias = renderer.renderTarget.rootRenderTarget.colorTexture.source.antialias;
    let blendRequired = false;
    let enabled = false;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      resolution = Math.min(resolution, filter.resolution);
      padding += filter.padding;
      if (filter.antialias !== "inherit") {
        if (filter.antialias === "on") {
          antialias = true;
        } else {
          antialias = false;
        }
      }
      enabled = filter.enabled || enabled;
      blendRequired = blendRequired || filter.blendRequired;
    }
    if (!enabled) {
      filterData.skip = true;
      return;
    }
    bounds.scale(resolution).fit(renderer.renderTarget.rootRenderTarget.viewport).scale(1 / resolution).pad(padding).ceil();
    if (!bounds.isPositive) {
      filterData.skip = true;
      return;
    }
    filterData.skip = false;
    filterData.bounds = bounds;
    filterData.blendRequired = blendRequired;
    filterData.container = instruction.container;
    filterData.filterEffect = instruction.filterEffect;
    filterData.previousRenderSurface = renderer.renderTarget.renderTarget;
    filterData.inputTexture = TexturePool.getOptimalTexture(
      bounds.width,
      bounds.height,
      resolution,
      antialias
    );
    renderer.renderTarget.bind(filterData.inputTexture, true);
    renderer.globalUniforms.push({
      offset: bounds
    });
  }
  pop() {
    const renderer = this.renderer;
    this.filterStackIndex--;
    const filterData = this.filterStack[this.filterStackIndex];
    if (filterData.skip) {
      return;
    }
    this.activeFilterData = filterData;
    const inputTexture = filterData.inputTexture;
    const bounds = filterData.bounds;
    let backTexture = Texture.EMPTY;
    if (filterData.blendRequired) {
      renderer.encoder.finishRenderPass();
      backTexture = this.getBackTexture(filterData.previousRenderSurface, bounds);
    }
    const offset = Point.shared;
    if (this.filterStackIndex > 0) {
      offset.x = this.filterStack[this.filterStackIndex - 1].bounds.minX;
      offset.y = this.filterStack[this.filterStackIndex - 1].bounds.minY;
    }
    this.updateGlobalFilterUniforms(bounds, inputTexture, backTexture, offset);
    const filters = filterData.filterEffect.filters;
    this.filterGlobalUniforms.update();
    let globalUniforms = this.filterGlobalUniforms;
    if (renderer.renderPipes.uniformBatch) {
      globalUniforms = renderer.renderPipes.uniformBatch.getUniformBufferResource(this.filterGlobalUniforms);
    }
    this.globalFilterBindGroup.setResource(globalUniforms, 0);
    this.globalFilterBindGroup.setResource(inputTexture.style, 2);
    this.globalFilterBindGroup.setResource(backTexture.source, 3);
    if (filters.length === 1) {
      renderer.globalUniforms.pop();
      filters[0].apply(this, inputTexture, filterData.previousRenderSurface, false);
      TexturePool.returnTexture(inputTexture);
    } else {
      let flip = filterData.inputTexture;
      const outputFrame = this.filterGlobalUniforms.uniforms.outputFrame;
      const oX = outputFrame[0];
      const oY = outputFrame[1];
      outputFrame[0] = 0;
      outputFrame[1] = 0;
      this.filterGlobalUniforms.update();
      if (renderer.renderPipes.uniformBatch) {
        const globalUniforms2 = renderer.renderPipes.uniformBatch.getUniformBufferResource(this.filterGlobalUniforms);
        this.globalFilterBindGroup.setResource(globalUniforms2, 0);
      }
      let flop = TexturePool.getOptimalTexture(
        bounds.width,
        bounds.height,
        flip.source._resolution,
        false
      );
      let i = 0;
      for (i = 0; i < filters.length - 1; ++i) {
        const filter = filters[i];
        filter.apply(this, flip, flop, true);
        const t = flip;
        flip = flop;
        flop = t;
      }
      renderer.globalUniforms.pop();
      if (renderer.renderPipes.uniformBatch) {
        this.globalFilterBindGroup.setResource(globalUniforms, 0);
      } else {
        outputFrame[0] = oX;
        outputFrame[1] = oY;
        this.filterGlobalUniforms.update();
      }
      filters[i].apply(this, flip, filterData.previousRenderSurface, false);
      TexturePool.returnTexture(flip);
      TexturePool.returnTexture(flop);
    }
    if (filterData.blendRequired) {
      TexturePool.returnTexture(backTexture);
    }
  }
  updateGlobalFilterUniforms(bounds, texture, backTexture, offset) {
    const bx = bounds.minX;
    const by = bounds.minY;
    const uniforms = this.filterGlobalUniforms.uniforms;
    const outputFrame = uniforms.outputFrame;
    const inputSize = uniforms.inputSize;
    const inputPixel = uniforms.inputPixel;
    const inputClamp = uniforms.inputClamp;
    const backgroundFrame = uniforms.backgroundFrame;
    const globalFrame = uniforms.globalFrame;
    outputFrame[0] = bx - offset.x;
    outputFrame[1] = by - offset.y;
    outputFrame[2] = texture.frameWidth;
    outputFrame[3] = texture.frameHeight;
    inputSize[0] = texture.source.width;
    inputSize[1] = texture.source.height;
    inputSize[2] = 1 / inputSize[0];
    inputSize[3] = 1 / inputSize[1];
    inputPixel[0] = texture.source.pixelWidth;
    inputPixel[1] = texture.source.pixelHeight;
    inputPixel[2] = 1 / inputPixel[0];
    inputPixel[3] = 1 / inputPixel[1];
    inputClamp[0] = 0.5 * inputPixel[2];
    inputClamp[1] = 0.5 * inputPixel[3];
    inputClamp[2] = texture.frameWidth * inputSize[2] - 0.5 * inputPixel[2];
    inputClamp[3] = texture.frameHeight * inputSize[3] - 0.5 * inputPixel[3];
    backgroundFrame[0] = 0;
    backgroundFrame[1] = 0;
    backgroundFrame[2] = backTexture.layout.frame.width;
    backgroundFrame[3] = backTexture.layout.frame.height;
    let resolution = this.renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution;
    if (this.filterStackIndex > 0) {
      resolution = this.filterStack[this.filterStackIndex - 1].inputTexture.source._resolution;
    }
    globalFrame[0] = offset.x * resolution;
    globalFrame[1] = offset.y * resolution;
    const rootTexture = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    globalFrame[2] = rootTexture.source.width * resolution;
    globalFrame[3] = rootTexture.source.height * resolution;
  }
  getBackTexture(lastRenderSurface, bounds) {
    const backgroundResolution = lastRenderSurface.colorTexture.source._resolution;
    const backTexture = TexturePool.getOptimalTexture(
      bounds.width,
      bounds.height,
      backgroundResolution,
      false
    );
    let x = bounds.minX;
    let y = bounds.minY;
    if (this.filterStackIndex) {
      x -= this.filterStack[this.filterStackIndex - 1].bounds.minX;
      y -= this.filterStack[this.filterStackIndex - 1].bounds.minY;
    }
    x = Math.floor(x * backgroundResolution);
    y = Math.floor(y * backgroundResolution);
    const width = Math.ceil(bounds.width * backgroundResolution);
    const height = Math.ceil(bounds.height * backgroundResolution);
    this.renderer.renderTarget.copyToTexture(
      lastRenderSurface,
      backTexture,
      { x, y },
      { width, height }
    );
    return backTexture;
  }
  applyFilter(filter, input, output, clear) {
    const renderer = this.renderer;
    renderer.renderTarget.bind(output, !!clear);
    this.globalFilterBindGroup.setResource(input.source, 1);
    filter.groups[0] = renderer.globalUniforms.bindGroup;
    filter.groups[1] = this.globalFilterBindGroup;
    renderer.encoder.draw({
      geometry: quadGeometry,
      shader: filter,
      state: filter._state,
      topology: "triangle-list"
    });
  }
  getFilterData() {
    return {
      skip: false,
      inputTexture: null,
      bounds: new Bounds(),
      container: null,
      filterEffect: null,
      blendRequired: false,
      previousRenderSurface: null
    };
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {PIXI.Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(outputMatrix, sprite) {
    const data = this.activeFilterData;
    const mappedMatrix = outputMatrix.set(
      data.inputTexture._source.width,
      0,
      0,
      data.inputTexture._source.height,
      data.bounds.minX,
      data.bounds.minY
    );
    const worldTransform = sprite.worldTransform.copyTo(Matrix.shared);
    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);
    mappedMatrix.scale(1 / sprite.texture.frameWidth, 1 / sprite.texture.frameHeight);
    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
    return mappedMatrix;
  }
  destroy() {
  }
}
/** @ignore */
FilterSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem
  ],
  name: "filter"
};

export { FilterSystem };
//# sourceMappingURL=FilterSystem.mjs.map
