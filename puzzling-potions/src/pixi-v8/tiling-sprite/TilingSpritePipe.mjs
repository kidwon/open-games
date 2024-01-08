import { ExtensionType } from '../extensions/Extensions.mjs';
import { Matrix } from '../maths/Matrix.mjs';
import { MeshView } from '../rendering/mesh/shared/MeshView.mjs';
import { ProxyRenderable } from '../rendering/renderers/shared/ProxyRenderable.mjs';
import { QuadGeometry } from './QuadGeometry.mjs';
import { TilingSpriteShader } from './shader/TilingSpriteShader.mjs';

const sharedQuad = new QuadGeometry();
class TilingSpritePipe {
  constructor(renderer) {
    this.renderableHash = {};
    // TODO can prolly merge these properties into a single mesh and
    // add them onto the renderableHash (rather than having them on separate hashes)
    this.gpuBatchedTilingSprite = {};
    this.gpuTilingSprite = {};
    this.renderer = renderer;
  }
  validateRenderable(renderable) {
    const textureMatrix = renderable.view.texture.textureMatrix;
    let rebuild = false;
    const renderableData = this.getRenderableData(renderable);
    if (renderableData.batched !== textureMatrix.isSimple) {
      renderableData.batched = textureMatrix.isSimple;
      rebuild = true;
    }
    return rebuild;
  }
  addRenderable(renderable, instructionSet) {
    if (renderable.view.didUpdate) {
      renderable.view.didUpdate = false;
      this.rebuild(renderable);
    }
    const { batched } = this.getRenderableData(renderable);
    if (batched) {
      const batchableTilingSprite = this.getBatchedTilingSprite(renderable);
      this.renderer.renderPipes.mesh.addRenderable(batchableTilingSprite, instructionSet);
    } else {
      const gpuTilingSprite = this.getGpuTilingSprite(renderable);
      this.renderer.renderPipes.mesh.addRenderable(gpuTilingSprite.meshRenderable, instructionSet);
    }
  }
  updateRenderable(renderable) {
    if (renderable.view.didUpdate) {
      renderable.view.didUpdate = false;
      this.rebuild(renderable);
    }
    const { batched } = this.getRenderableData(renderable);
    if (batched) {
      const batchableTilingSprite = this.getBatchedTilingSprite(renderable);
      this.renderer.renderPipes.mesh.updateRenderable(batchableTilingSprite);
    } else {
      const gpuTilingSprite = this.getGpuTilingSprite(renderable);
      this.renderer.renderPipes.mesh.updateRenderable(gpuTilingSprite.meshRenderable);
    }
  }
  destroyRenderable(renderable) {
    this.renderableHash[renderable.uid] = null;
    this.gpuTilingSprite[renderable.uid] = null;
    this.gpuBatchedTilingSprite[renderable.uid] = null;
  }
  getRenderableData(renderable) {
    return this.renderableHash[renderable.uid] || this.initRenderableData(renderable);
  }
  initRenderableData(renderable) {
    const renderableData = {
      batched: true
    };
    this.renderableHash[renderable.uid] = renderableData;
    this.validateRenderable(renderable);
    renderable.on("destroyed", () => {
      this.destroyRenderable(renderable);
    });
    return renderableData;
  }
  rebuild(renderable) {
    const renderableData = this.getRenderableData(renderable);
    const view = renderable.view;
    const textureMatrix = view.texture.textureMatrix;
    if (renderableData.batched) {
      const batchedMesh = this.getBatchedTilingSprite(renderable);
      batchedMesh.view.texture = view.texture;
      view.texture.style.addressMode = "repeat";
      view.texture.style.update();
      this.updateBatchPositions(renderable);
      this.updateBatchUvs(renderable);
    } else {
      const gpuTilingSprite = this.getGpuTilingSprite(renderable);
      const { meshRenderable } = gpuTilingSprite;
      const meshView = meshRenderable.view;
      meshView.shader.texture = view.texture;
      const tilingUniforms = meshView.shader.resources.tilingUniforms;
      const originalWidth = view.width;
      const originalHeight = view.height;
      const tilingSpriteWidth = view.texture.width;
      const tilingSpriteHeight = view.texture.height;
      const matrix = view.tileTransform.matrix;
      const uTextureTransform = tilingUniforms.uniforms.uTextureTransform;
      uTextureTransform.set(
        matrix.a * tilingSpriteWidth / originalWidth,
        matrix.b * tilingSpriteWidth / originalHeight,
        matrix.c * tilingSpriteHeight / originalWidth,
        matrix.d * tilingSpriteHeight / originalHeight,
        matrix.tx / originalWidth,
        matrix.ty / originalHeight
      );
      uTextureTransform.invert();
      tilingUniforms.uniforms.uMapCoord = textureMatrix.mapCoord;
      tilingUniforms.uniforms.uClampFrame = textureMatrix.uClampFrame;
      tilingUniforms.uniforms.uClampOffset = textureMatrix.uClampOffset;
      tilingUniforms.uniforms.uTextureTransform = uTextureTransform;
      tilingUniforms.uniforms.uSizeAnchor[0] = originalWidth;
      tilingUniforms.uniforms.uSizeAnchor[1] = originalHeight;
      tilingUniforms.uniforms.uSizeAnchor[2] = renderable.view.anchor.x;
      tilingUniforms.uniforms.uSizeAnchor[3] = renderable.view.anchor.y;
      tilingUniforms.update();
    }
  }
  getGpuTilingSprite(renderable) {
    return this.gpuTilingSprite[renderable.uid] || this.initGpuTilingSprite(renderable);
  }
  initGpuTilingSprite(renderable) {
    const view = renderable.view;
    view.texture.style.addressMode = "repeat";
    view.texture.style.update();
    const meshView = new MeshView({
      geometry: sharedQuad,
      shader: new TilingSpriteShader({
        texture: view.texture
      })
    });
    const meshRenderable = new ProxyRenderable({
      original: renderable,
      view: meshView
    });
    const textureMatrix = new Matrix();
    const gpuTilingSpriteData = {
      meshRenderable,
      textureMatrix
    };
    this.gpuTilingSprite[renderable.uid] = gpuTilingSpriteData;
    return gpuTilingSpriteData;
  }
  getBatchedTilingSprite(renderable) {
    return this.gpuBatchedTilingSprite[renderable.uid] || this.initBatchedTilingSprite(renderable);
  }
  initBatchedTilingSprite(renderable) {
    const meshView = new MeshView({
      geometry: new QuadGeometry(),
      texture: renderable.view.texture
    });
    const batchableMeshRenderable = new ProxyRenderable({
      original: renderable,
      view: meshView
    });
    this.gpuBatchedTilingSprite[renderable.uid] = batchableMeshRenderable;
    return batchableMeshRenderable;
  }
  updateBatchPositions(renderable) {
    const meshRenderable = this.getBatchedTilingSprite(renderable);
    const view = renderable.view;
    const positionBuffer = meshRenderable.view.geometry.getBuffer("aPosition");
    const positions = positionBuffer.data;
    const anchorX = view.anchor.x;
    const anchorY = view.anchor.y;
    positions[0] = -anchorX * view.width;
    positions[1] = -anchorY * view.height;
    positions[2] = (1 - anchorX) * view.width;
    positions[3] = -anchorY * view.height;
    positions[4] = (1 - anchorX) * view.width;
    positions[5] = (1 - anchorY) * view.height;
    positions[6] = -anchorX * view.width;
    positions[7] = (1 - anchorY) * view.height;
  }
  updateBatchUvs(renderable) {
    const view = renderable.view;
    const width = view.texture.frameWidth;
    const height = view.texture.frameHeight;
    const meshRenderable = this.getBatchedTilingSprite(renderable);
    const uvBuffer = meshRenderable.view.geometry.getBuffer("aUV");
    const uvs = uvBuffer.data;
    let anchorX = 0;
    let anchorY = 0;
    if (view.applyAnchorToTexture) {
      anchorX = view.anchor.x;
      anchorY = view.anchor.y;
    }
    uvs[0] = uvs[6] = -anchorX;
    uvs[2] = uvs[4] = 1 - anchorX;
    uvs[1] = uvs[3] = -anchorY;
    uvs[5] = uvs[7] = 1 - anchorY;
    const textureMatrix = Matrix.shared;
    textureMatrix.copyFrom(view.tileTransform.matrix);
    textureMatrix.tx /= view.width;
    textureMatrix.ty /= view.height;
    textureMatrix.invert();
    textureMatrix.scale(view.width / width, view.height / height);
    applyMatrix(uvs, 2, 0, textureMatrix);
  }
  destroy() {
    this.renderableHash = null;
    this.gpuTilingSprite = null;
    this.gpuBatchedTilingSprite = null;
    this.renderer = null;
  }
}
/** @ignore */
TilingSpritePipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "tilingSprite"
};
function applyMatrix(array, stride, offset, matrix) {
  let index = 0;
  const size = array.length / (stride || 2);
  const a = matrix.a;
  const b = matrix.b;
  const c = matrix.c;
  const d = matrix.d;
  const tx = matrix.tx;
  const ty = matrix.ty;
  offset *= stride;
  while (index < size) {
    const x = array[offset];
    const y = array[offset + 1];
    array[offset] = a * x + c * y + tx;
    array[offset + 1] = b * x + d * y + ty;
    offset += stride;
    index++;
  }
}

export { TilingSpritePipe, applyMatrix };
//# sourceMappingURL=TilingSpritePipe.mjs.map
