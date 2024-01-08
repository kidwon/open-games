'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Shader = require('../renderers/shared/shader/Shader.js');
var State = require('../renderers/shared/state/State.js');

const _Filter = class extends Shader.Shader {
  constructor(options) {
    options = { ..._Filter.defaultOptions, ...options };
    super({
      gpuProgram: options.gpuProgram,
      glProgram: options.glProgram,
      resources: options.resources
    });
    /** If enabled is true the filter is applied, if false it will not. */
    this.enabled = true;
    /**
     * The WebGL state the filter requires to render.
     * @internal
     */
    this._state = State.State.for2d();
    this.padding = options.padding;
    if (typeof options.antialias === "boolean") {
      this.antialias = options.antialias ? "on" : "off";
    } else {
      this.antialias = options.antialias ?? "inherit";
    }
    this.resolution = options.resolution;
    this.blendRequired = options.blendRequired;
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  apply(filterManager, input, output, clearMode) {
    filterManager.applyFilter(this, input, output, clearMode);
  }
  /**
   * Sets the blend mode of the filter.
   * @default PIXI.BLEND_MODES.NORMAL
   */
  get blendMode() {
    return this._state.blendMode;
  }
  set blendMode(value) {
    this._state.blendMode = value;
  }
};
let Filter = _Filter;
/**
 * The default filter settings
 * @static
 */
Filter.defaultOptions = {
  blendMode: "normal",
  resolution: 1,
  padding: 0,
  antialias: "inherit",
  blendRequired: false
};

exports.Filter = Filter;
//# sourceMappingURL=Filter.js.map
