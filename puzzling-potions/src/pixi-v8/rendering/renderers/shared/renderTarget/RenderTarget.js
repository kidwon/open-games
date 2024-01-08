'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../../maths/Matrix.js');
var Rectangle = require('../../../../maths/shapes/Rectangle.js');
var calculateProjection = require('../../gpu/renderTarget/calculateProjection.js');
var TextureSource = require('../texture/sources/TextureSource.js');
var Texture = require('../texture/Texture.js');

let UID = 0;
const _RenderTarget = class {
  constructor(descriptor = {}) {
    this.uid = UID++;
    this.width = 0;
    this.height = 0;
    this.resolution = 1;
    this.colorTextures = [];
    this.clearColor = 0;
    this.dirtyId = 0;
    this.isRoot = false;
    this._projectionMatrix = new Matrix.Matrix();
    descriptor = { ..._RenderTarget.defaultDescriptor, ...descriptor };
    this.width = descriptor.width;
    this.height = descriptor.height;
    this.resolution = descriptor.resolution;
    this.stencil = descriptor.stencil;
    this._viewport = new Rectangle.Rectangle(0, 0, this.width, this.height);
    if (typeof descriptor.colorTextures === "number") {
      for (let i = 0; i < descriptor.colorTextures; i++) {
        this.colorTextures.push(new Texture.Texture({
          source: new TextureSource.TextureSource({
            width: this.width,
            height: this.height,
            resolution: descriptor.resolution,
            antialias: descriptor.antialias
          })
        }));
      }
    } else {
      this.colorTextures = [...descriptor.colorTextures];
      const colorSource = this.colorTexture.source;
      this.resize(colorSource.width, colorSource.height, colorSource._resolution);
    }
    this.colorTexture.source.on("resize", this.onSourceResize, this);
    if (descriptor.depthTexture) {
      this.depthTexture = new Texture.Texture({
        source: new TextureSource.TextureSource({
          width: this.width,
          height: this.height,
          resolution: this.resolution,
          format: "stencil8"
          // sampleCount: handled by the render target system..
        })
      });
    }
  }
  get pixelWidth() {
    return this.width * this.resolution;
  }
  get pixelHeight() {
    return this.height * this.resolution;
  }
  get colorTexture() {
    return this.colorTextures[0];
  }
  get projectionMatrix() {
    const texture = this.colorTexture;
    calculateProjection.calculateProjection(this._projectionMatrix, 0, 0, texture.frameWidth, texture.frameHeight, !this.isRoot);
    return this._projectionMatrix;
  }
  get viewport() {
    const texture = this.colorTexture;
    const source = texture.source;
    const pixelWidth = source.pixelWidth;
    const pixelHeight = source.pixelHeight;
    const viewport = this._viewport;
    const frame = texture.layout.frame;
    viewport.x = frame.x * pixelWidth | 0;
    viewport.y = frame.y * pixelHeight | 0;
    viewport.width = frame.width * pixelWidth | 0;
    viewport.height = frame.height * pixelHeight | 0;
    return viewport;
  }
  onSourceResize(source) {
    this.resize(source.width, source.height, source._resolution, true);
  }
  resize(width, height, resolution = this.resolution, skipColorTexture = false) {
    this.width = width;
    this.height = height;
    this.resolution = resolution;
    this.dirtyId++;
    this.colorTextures.forEach((colorTexture, i) => {
      if (skipColorTexture && i === 0)
        return;
      colorTexture.source.resize(width, height, resolution);
    });
    if (this.depthTexture) {
      this.depthTexture.source.resize(width, height, resolution);
    }
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
};
let RenderTarget = _RenderTarget;
RenderTarget.defaultDescriptor = {
  width: 0,
  height: 0,
  resolution: 1,
  colorTextures: 1,
  stencil: true,
  antialias: false
  // save on perf by default!
};

exports.RenderTarget = RenderTarget;
//# sourceMappingURL=RenderTarget.js.map
