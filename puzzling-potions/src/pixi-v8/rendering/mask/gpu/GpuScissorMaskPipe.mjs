import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { getGlobalBounds } from '../../scene/bounds/getGlobalBounds.mjs';

const tempBounds = new Bounds();
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
      const bounds = getGlobalBounds(instruction.mask.mask, true, tempBounds);
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
    ExtensionType.WebGPUPipes
  ],
  name: "scissorMask"
};

export { GpuScissorMaskPipe };
//# sourceMappingURL=GpuScissorMaskPipe.mjs.map
