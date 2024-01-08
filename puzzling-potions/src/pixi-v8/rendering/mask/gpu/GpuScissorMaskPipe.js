'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Bounds = require('../../scene/bounds/Bounds.js');
var getGlobalBounds = require('../../scene/bounds/getGlobalBounds.js');

const tempBounds = new Bounds.Bounds();
class GpuScissorMaskPipe {
  constructor(renderer) {
    this.renderer = renderer;
  }
  push(mask, _container, instructionSet) {
    this.renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "scissorMask",
      action: "pushMaskBegin",
      mask,
      canBundle: false
    });
  }
  pop(_mask, _container, instructionSet) {
    this.renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "scissorMask",
      action: "popMaskEnd",
      canBundle: false
    });
  }
  execute(instruction) {
    const renderer = this.renderer;
    if (instruction.action === "pushMaskBegin") {
      const bounds = getGlobalBounds.getGlobalBounds(instruction.mask.mask, true, tempBounds);
      bounds.ceil();
      renderer.encoder.setScissor(bounds);
    } else if (instruction.action === "popMaskEnd") {
      renderer.encoder.clearScissor();
    }
  }
}
/** @ignore */
GpuScissorMaskPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGPUPipes
  ],
  name: "scissorMask"
};

exports.GpuScissorMaskPipe = GpuScissorMaskPipe;
//# sourceMappingURL=GpuScissorMaskPipe.js.map
