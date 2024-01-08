import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { hex2string, hex2rgb } from '../../../../utils/color/hex.mjs';

const defaultBackgroundOptions = {
  alpha: 1,
  color: 0,
  clearBeforeRender: true
};
class BackgroundSystem {
  constructor() {
    this.clearBeforeRender = true;
    this._backgroundColor = 0;
    this._backgroundColorRgba = [0, 0, 0, 1];
    this._backgroundColorRgbaObject = { r: 0, g: 0, b: 0, a: 1 };
    this._backgroundColorString = "#000000";
    this.color = this._backgroundColor;
    this.alpha = 1;
  }
  /**
   * initiates the background system
   * @param options - the options for the background colors
   */
  init(options) {
    options = { ...defaultBackgroundOptions, ...options };
    this.clearBeforeRender = options.clearBeforeRender;
    this.color = options.backgroundColor || this._backgroundColor;
    this.alpha = options.backgroundAlpha;
  }
  /** The background color to fill if not transparent */
  get color() {
    return this._backgroundColor;
  }
  set color(value) {
    this._backgroundColor = value;
    this._backgroundColorString = hex2string(value);
    const rgbaObject = this._backgroundColorRgbaObject;
    const rgba = this._backgroundColorRgba;
    hex2rgb(value, rgba);
    rgbaObject.r = rgba[0];
    rgbaObject.g = rgba[1];
    rgbaObject.b = rgba[2];
    rgbaObject.a = rgba[3];
  }
  /** The background color alpha. Setting this to 0 will make the canvas transparent. */
  get alpha() {
    return this._backgroundColorRgba[3];
  }
  set alpha(value) {
    this._backgroundColorRgba[3] = value;
  }
  /** The background color as an [R, G, B, A] array. */
  get colorRgba() {
    return this._backgroundColorRgba;
  }
  get colorRgbaObject() {
    return this._backgroundColorRgbaObject;
  }
  /** The background color as a string. */
  get colorString() {
    return this._backgroundColorString;
  }
  destroy() {
  }
}
/** @ignore */
BackgroundSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "background",
  priority: 0
};
/** @ignore */
BackgroundSystem.defaultOptions = {
  /**
   * {@link PIXI.WebGLOptions.backgroundAlpha}
   * @default 1
   */
  backgroundAlpha: 1,
  /**
   * {@link PIXI.WebGLOptions.backgroundColor}
   * @default 0x000000
   */
  backgroundColor: 0,
  /**
   * {@link PIXI.WebGLOptions.clearBeforeRender}
   * @default true
   */
  clearBeforeRender: true
};

export { BackgroundSystem, defaultBackgroundOptions };
//# sourceMappingURL=BackgroundSystem.mjs.map
