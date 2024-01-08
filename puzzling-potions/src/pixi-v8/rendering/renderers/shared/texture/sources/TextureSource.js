'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var TextureStyle = require('../TextureStyle.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

let UID = 0;
let RESOURCE_ID = 0;
class TextureSource extends EventEmitter__default["default"] {
  constructor(options = {}) {
    super();
    this.uid = UID++;
    this.resourceType = "textureSource";
    this.resourceId = RESOURCE_ID++;
    this.type = "unknown";
    // dimensions
    this._resolution = 1;
    this.pixelWidth = 1;
    this.pixelHeight = 1;
    this.width = 1;
    this.height = 1;
    // sample count for multisample textures
    // generally this is used only used internally by pixi!
    this.sampleCount = 1;
    // antialias = false;
    // mip stuff..
    this.mipLevelCount = 1;
    // overridden if autoGenerateMipmaps is true
    this.autoGenerateMipmaps = false;
    this.format = "rgba8unorm-srgb";
    this.viewDimensions = "2d";
    this.dimension = "2d";
    // properties used when rendering to this texture..
    this.antialias = false;
    this.depthStencil = true;
    this.resource = options.resource;
    this._resolution = options.resolution ?? 1;
    if (options.width) {
      this.pixelWidth = options.width * this._resolution;
    } else {
      this.pixelWidth = options.resource?.width ?? 1;
    }
    if (options.height) {
      this.pixelHeight = options.height * this._resolution;
    } else {
      this.pixelHeight = options.resource?.height ?? 1;
    }
    this.width = this.pixelWidth / this._resolution;
    this.height = this.pixelHeight / this._resolution;
    this.format = options.format ?? "bgra8unorm";
    this.viewDimensions = options.view ?? "2d";
    this.dimension = options.dimensions ?? "2d";
    this.mipLevelCount = options.mipLevelCount ?? 1;
    this.autoGenerateMipmaps = options.autoGenerateMipmaps ?? false;
    this.sampleCount = options.sampleCount ?? 1;
    this.antialias = options.antialias ?? false;
    const style = options.style ?? {};
    this.style = style instanceof TextureStyle.TextureStyle ? style : new TextureStyle.TextureStyle(style);
    this.style.on("change", this.onStyleUpdate, this);
    this.styleSourceKey = (this.style.resourceId << 24) + this.uid;
  }
  get source() {
    return this;
  }
  update() {
    this.emit("update", this);
  }
  onStyleUpdate() {
    this.styleSourceKey = (this.style.resourceId << 24) + this.uid;
  }
  /** Destroys this texture source */
  destroy() {
    this.emit("destroy", this);
    if (this.style) {
      this.style.destroy();
      this.style = null;
    }
    this.type = null;
    this.resource = null;
    this.removeAllListeners();
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(resolution) {
    if (this._resolution === resolution)
      return;
    this._resolution = resolution;
    this.width = this.pixelWidth / resolution;
    this.height = this.pixelHeight / resolution;
  }
  resize(width, height, resolution) {
    resolution = resolution || this._resolution;
    width = width || this.width;
    height = height || this.height;
    const newPixelWidth = Math.round(width * resolution);
    const newPixelHeight = Math.round(height * resolution);
    this.width = newPixelWidth / resolution;
    this.height = newPixelHeight / resolution;
    this._resolution = resolution;
    if (this.pixelWidth === newPixelWidth && this.pixelHeight === newPixelHeight) {
      return;
    }
    this.pixelWidth = newPixelWidth;
    this.pixelHeight = newPixelHeight;
    this.emit("resize", this);
    this.resourceId++;
    this.emit("change", this);
  }
}

exports.TextureSource = TextureSource;
//# sourceMappingURL=TextureSource.js.map
