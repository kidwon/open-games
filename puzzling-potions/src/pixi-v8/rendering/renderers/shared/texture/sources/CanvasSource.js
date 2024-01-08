'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../../../../settings/settings.js');
var TextureSource = require('./TextureSource.js');

class CanvasSource extends TextureSource.TextureSource {
  constructor(options) {
    if (!options.resource) {
      options.resource = settings.settings.ADAPTER.createCanvas();
    }
    if (!options.width) {
      options.width = options.resource.width;
      if (!options.autoDensity) {
        options.width /= options.resolution;
      }
    }
    if (!options.height) {
      options.height = options.resource.height;
      if (!options.autoDensity) {
        options.height /= options.resolution;
      }
    }
    super(options);
    this.type = "image";
    this.alphaMode = 0;
    this.autoDensity = options.autoDensity;
    const canvas = options.resource;
    if (this.pixelWidth !== canvas.width || this.pixelWidth !== canvas.height) {
      this.resizeCanvas();
    }
  }
  resizeCanvas() {
    if (this.autoDensity) {
      this.resource.style.width = `${this.width}px`;
      this.resource.style.height = `${this.height}px`;
    }
    this.resource.width = this.pixelWidth;
    this.resource.height = this.pixelHeight;
  }
  resize(width = this.width, height = this.height, resolution = this._resolution) {
    super.resize(width, height, resolution);
    this.resizeCanvas();
  }
}

exports.CanvasSource = CanvasSource;
//# sourceMappingURL=CanvasSource.js.map
