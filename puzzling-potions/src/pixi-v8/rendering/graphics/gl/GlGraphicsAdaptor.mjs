import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { MAX_TEXTURES } from '../../batcher/shared/const.mjs';
import { batchSamplersUniformGroup } from '../../renderers/gl/shader/batchSamplersUniformGroup.mjs';
import { Shader } from '../../renderers/shared/shader/Shader.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { color32BitToUniform } from '../gpu/colorToUniform.mjs';
import { generateDefaultGraphicsBatchGlProgram } from './generateDefaultGraphicsBatchGlProgram.mjs';

class GlGraphicsAdaptor {
  init() {
    const uniforms = new UniformGroup({
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      transformMatrix: { value: new Matrix(), type: "mat3x3<f32>" }
    });
    this.shader = new Shader({
      glProgram: generateDefaultGraphicsBatchGlProgram(MAX_TEXTURES),
      resources: {
        localUniforms: uniforms,
        batchSamplers: batchSamplersUniformGroup
      }
    });
  }
  execute(graphicsPipe, renderable) {
    const context = renderable.view.context;
    const shader = context.customShader || this.shader;
    const renderer = graphicsPipe.renderer;
    const contextSystem = renderer.graphicsContext;
    if (!contextSystem.updateGpuContext(context).batches.length) {
      return;
    }
    const {
      geometry,
      batches
    } = contextSystem.getContextRenderData(context);
    const state = graphicsPipe.state;
    state.blendMode = renderable.layerBlendMode;
    renderer.state.set(graphicsPipe.state);
    const localUniforms = shader.resources.localUniforms.uniforms;
    localUniforms.transformMatrix = renderable.layerTransform;
    color32BitToUniform(
      renderable.layerColor,
      localUniforms.color,
      0
    );
    renderer.shader.bind(shader);
    renderer.shader.bindUniformBlock(renderer.globalUniforms.uniformGroup, "globalUniforms");
    renderer.geometry.bind(geometry, shader.glProgram);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (batch.size) {
        for (let j = 0; j < batch.textures.textures.length; j++) {
          renderer.texture.bind(batch.textures.textures[j], j);
        }
        renderer.geometry.draw("triangle-list", batch.size, batch.start);
      }
    }
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GlGraphicsAdaptor.extension = {
  type: [
    ExtensionType.WebGLPipesAdaptor
  ],
  name: "graphics"
};

export { GlGraphicsAdaptor };
//# sourceMappingURL=GlGraphicsAdaptor.mjs.map
