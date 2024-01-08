import { ExtensionType } from '../../../extensions/Extensions.mjs';

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
    ExtensionType.WebGLSystem
  ],
  name: "colorMask"
};

export { GlColorMaskSystem };
//# sourceMappingURL=GlColorMaskSystem.mjs.map
