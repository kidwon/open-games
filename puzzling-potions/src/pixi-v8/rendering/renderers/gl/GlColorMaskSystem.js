'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');

class GlColorMaskSystem {
  constructor(renderer) {
    this.colorMaskCache = 15;
    this.renderer = renderer;
  }
  setMask(colorMask) {
    if (this.colorMaskCache === colorMask)
      return;
    this.colorMaskCache = colorMask;
    this.renderer.gl.colorMask(
      !!(colorMask & 8),
      !!(colorMask & 4),
      !!(colorMask & 2),
      !!(colorMask & 1)
    );
  }
  destroy() {
  }
}
/** @ignore */
GlColorMaskSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "colorMask"
};

exports.GlColorMaskSystem = GlColorMaskSystem;
//# sourceMappingURL=GlColorMaskSystem.js.map
