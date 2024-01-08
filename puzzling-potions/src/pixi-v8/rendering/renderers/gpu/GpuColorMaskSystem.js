'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');

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
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "colorMask"
};

exports.GpuColorMaskSystem = GpuColorMaskSystem;
//# sourceMappingURL=GpuColorMaskSystem.js.map
