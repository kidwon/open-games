import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { MAX_TEXTURES } from '../../batcher/shared/const.mjs';
import { BindGroup } from '../../renderers/gpu/shader/BindGroup.mjs';
import { Shader } from '../../renderers/shared/shader/Shader.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { color32BitToUniform } from './colorToUniform.mjs';
import { generateDefaultGraphicsBatchProgram } from './generateDefaultGraphicsBatchProgram.mjs';

class GpuGraphicsAdaptor {
  init() {
    const localUniforms = new UniformGroup({
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      transformMatrix: { value: new Matrix(), type: "mat3x3<f32>" }
    });
    this.shader = new Shader({
      gpuProgram: generateDefaultGraphicsBatchProgram(MAX_TEXTURES),
      groups: {
        // added on the fly!
        2: new BindGroup({ 0: localUniforms })
      }
    });
  }
  execute(graphicsPipe, renderable) {
    const context = renderable.view.context;
    const shader = context.customShader || this.shader;
    const renderer = graphicsPipe.renderer;
    const contextSystem = renderer.graphicsContext;
    if (!contextSystem.getGpuContext(context).batches.length) {
      return;
    }
    const {
      geometry,
      batches
    } = contextSystem.getContextRenderData(context);
    graphicsPipe.state.blendMode = renderable.layerBlendMode;
    const localUniforms = shader.resources.localUniforms;
    shader.resources.localUniforms.uniforms.transformMatrix = renderable.layerTransform;
    color32BitToUniform(
      renderable.layerColor,
      localUniforms.uniforms.color,
      0
    );
    const encoder = renderer.encoder;
    encoder.setPipelineFromGeometryProgramAndState(
      geometry,
      shader.gpuProgram,
      graphicsPipe.state
    );
    encoder.setGeometry(geometry);
    const globalUniformsBindGroup = renderer.globalUniforms.bindGroup;
    encoder.setBindGroup(0, globalUniformsBindGroup, shader.gpuProgram);
    const localBindGroup = renderer.renderPipes.uniformBatch.getUniformBindGroup(localUniforms, true);
    encoder.setBindGroup(2, localBindGroup, shader.gpuProgram);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      shader.groups[1] = batch.textures.bindGroup;
      encoder.setBindGroup(1, batch.textures.bindGroup, shader.gpuProgram);
      encoder.renderPassEncoder.drawIndexed(batch.size, 1, batch.start);
    }
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GpuGraphicsAdaptor.extension = {
  type: [
    ExtensionType.WebGPUPipesAdaptor
  ],
  name: "graphics"
};

export { GpuGraphicsAdaptor };
//# sourceMappingURL=GpuGraphicsAdaptor.mjs.map
