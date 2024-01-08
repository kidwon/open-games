'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Shader = require('../../renderers/shared/shader/Shader.js');
var _const = require('../shared/const.js');
var generateDefaultBatchProgram = require('./generateDefaultBatchProgram.js');
var getTextureBatchBindGroup = require('./getTextureBatchBindGroup.js');

class GpuBatchAdaptor {
  init() {
    this.shader = new Shader.Shader({
      gpuProgram: generateDefaultBatchProgram.generateDefaultBatchProgram(_const.MAX_TEXTURES),
      groups: {
        // these will be dynamically allocated
      }
    });
  }
  execute(batchPipe, batch) {
    batchPipe.state.blendMode = batch.blendMode;
    if (!batch.textures.bindGroup) {
      batch.textures.bindGroup = getTextureBatchBindGroup.getTextureBatchBindGroup(batch.textures.textures);
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
    Extensions.ExtensionType.WebGPUPipesAdaptor
  ],
  name: "batch"
};

exports.GpuBatchAdaptor = GpuBatchAdaptor;
//# sourceMappingURL=GpuBatchAdaptor.js.map
