'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../../../../settings/settings.js');
var NOOP = require('../../../../../utils/NOOP.js');
var Texture = require('../Texture.js');
var TextureSource = require('./TextureSource.js');

class ImageSource extends TextureSource.TextureSource {
  constructor(options) {
    super(options);
    this.type = "image";
    this.alphaMode = options.alphaMode ?? 0;
  }
}
const canvas = settings.settings.ADAPTER.createCanvas();
const size = 1;
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, size, size);
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(size, 0);
ctx.lineTo(size, size);
ctx.closePath();
ctx.fillStyle = "#ffffff";
ctx.fill();
Texture.Texture.WHITE = new Texture.Texture({
  source: new ImageSource({
    resource: canvas
  })
});
Texture.Texture.WHITE.label = "WHITE";
Texture.Texture.WHITE.destroy = NOOP.NOOP;

exports.ImageSource = ImageSource;
//# sourceMappingURL=ImageSource.js.map
