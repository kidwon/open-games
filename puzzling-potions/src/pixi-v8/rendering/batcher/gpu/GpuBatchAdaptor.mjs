import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Shader } from '../../renderers/shared/shader/Shader.mjs';
import { MAX_TEXTURES } from '../shared/const.mjs';
import { generateDefaultBatchProgram } from './generateDefaultBatchProgram.mjs';
import { getTextureBatchBindGroup } from './getTextureBatchBindGroup.mjs';

class GpuBatchAdaptor {
  init() {
    this.shader = new Shader({
      gpuProgram: generateDefaultBatchProgram(MAX_TEXTURES),
      groups: {
        // these will be dynamically allocated
      }
    });
  }
  execute(batchPipe, batch) {
    batchPipe.state.blendMode = batch.blendMode;
    if (!batch.textures.bindGroup) {
      batch.textures.bindGroup = getTextureBatchBindGroup(batch.textures.textures);
    }
    const program = this.shader.gpuProgram;
    const encoder = batchPipe.renderer.encoder;
    const globalUniformsBindGroup = batchPipe.renderer.globalUniforms.bindGroup;
    this.shader.groups[1] = batch.textures.bindGroup;
    const activeBatcher = batch.batchParent;
    encoder.setPipelineFromGeometryProgramAndState(
      activeBatcher.geometry,
      program,
      batchPipe.state
    );
    encoder.setGeometry(activeBatcher.geometry);
    encoder.setBindGroup(0, globalUniformsBindGroup, program);
    encoder.setBindGroup(1, batch.textures.bindGroup, program);
    encoder.renderPassEncoder.drawIndexed(batch.size, 1, batch.start);
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GpuBatchAdaptor.extension = {
  type: [
    ExtensionType.WebGPUPipesAdaptor
  ],
  name: "batch"
};

export { GpuBatchAdaptor };
//# sourceMappingURL=GpuBatchAdaptor.mjs.map
