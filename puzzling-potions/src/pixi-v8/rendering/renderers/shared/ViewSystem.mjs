import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { settings } from '../../../settings/settings.mjs';
import { getCanvasTexture } from './texture/utils/getCanvasTexture.mjs';

class ViewSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  get resolution() {
    return this.texture.source._resolution;
  }
  set resolution(value) {
    this.texture.source.resize(
      this.texture.source.width,
      this.texture.source.height,
      value
    );
  }
  /**
   * initiates the view system
   * @param options - the options for the view
   */
  init(options) {
    this.element = options.element || settings.ADAPTER.createCanvas();
    this.antialias = !!options.antialias;
    this.texture = getCanvasTexture(this.element, options);
    this.multiView = !!options.multiView;
    if (this.autoDensity) {
      this.element.style.width = `${this.texture.width}px`;
      this.element.style.height = `${this.texture.height}px`;
    }
  }
  /**
   * Resizes the screen and canvas to the specified dimensions.
   * @param desiredScreenWidth - The new width of the screen.
   * @param desiredScreenHeight - The new height of the screen.
   * @param resolution
   */
  resize(desiredScreenWidth, desiredScreenHeight, resolution) {
    this.texture.source.resize(desiredScreenWidth, desiredScreenHeight, resolution);
    if (this.autoDensity) {
      this.element.style.width = `${desiredScreenWidth}px`;
      this.element.style.height = `${desiredScreenHeight}px`;
    }
  }
  /**
   * Destroys this System and optionally removes the canvas from the dom.
   * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
   */
  destroy(removeView) {
    if (removeView && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
/** @ignore */
ViewSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "view",
  priority: 0
};
/** @ignore */
ViewSystem.defaultOptions = {
  /**
   * {@link PIXI.WebGLOptions.width}
   * @default 800
   */
  width: 800,
  /**
   * {@link PIXI.WebGLOptions.height}
   * @default 600
   */
  height: 600,
  /**
   * {@link PIXI.WebGLOptions.resolution}
   * @type {number}
   * @default PIXI.settings.RESOLUTION
   */
  resolution: settings.RESOLUTION,
  /**
   * {@link PIXI.WebGLOptions.autoDensity}
   * @default false
   */
  autoDensity: true,
  /**
   * {@link PIXI.WebGLOptions.antialias}
   * @default false
   */
  antialias: false
};

export { ViewSystem };
//# sourceMappingURL=ViewSystem.mjs.map
