import { ExtensionType } from '../../../extensions/Extensions.mjs';

class GpuColorMaskSystem {
  constructor(renderer) {
    this.colorMaskCache = 15;
    this.renderer = renderer;
  }
  setMask(colorMask) {
    if (this.colorMaskCache === colorMask)
      return;
    this.colorMaskCache = colorMask;
    this.renderer.pipeline.setColorMask(colorMask);
  }
  destroy() {
  }
}
/** @ignore */
GpuColorMaskSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "colorMask"
};

export { GpuColorMaskSystem };
//# sourceMappingURL=GpuColorMaskSystem.mjs.map
