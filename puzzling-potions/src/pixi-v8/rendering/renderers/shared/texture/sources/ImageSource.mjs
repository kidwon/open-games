import { settings } from '../../../../../settings/settings.mjs';
import { NOOP } from '../../../../../utils/NOOP.mjs';
import { Texture } from '../Texture.mjs';
import { TextureSource } from './TextureSource.mjs';

class ImageSource extends TextureSource {
  constructor(options) {
    super(options);
    this.type = "image";
    this.alphaMode = options.alphaMode ?? 0;
  }
}
const canvas = settings.ADAPTER.createCanvas();
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
Texture.WHITE = new Texture({
  source: new ImageSource({
    resource: canvas
  })
});
Texture.WHITE.label = "WHITE";
Texture.WHITE.destroy = NOOP;

export { ImageSource };
//# sourceMappingURL=ImageSource.mjs.map
