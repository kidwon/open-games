import { Matrix } from '../../../../maths/Matrix.mjs';
import { settings } from '../../../../settings/settings.mjs';
import { convertNumberToHex } from '../../../../utils/color/convertNumberToHex.mjs';
import { ImageSource } from '../../../renderers/shared/texture/sources/ImageSource.mjs';
import { Texture } from '../../../renderers/shared/texture/Texture.mjs';

let UID = 0;
const _FillGradient = class {
  constructor(x0, y0, x1, y1) {
    this.uid = UID++;
    this.type = "linear";
    this.gradientStops = [];
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }
  addColorStop(offset, color) {
    color = convertNumberToHex(color);
    this.gradientStops.push({ offset, color });
    return this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const defaultSize = _FillGradient.defaultTextureSize;
    const { gradientStops } = this;
    const canvas = settings.ADAPTER.createCanvas();
    canvas.width = defaultSize;
    canvas.height = defaultSize;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, _FillGradient.defaultTextureSize, 1);
    for (let i = 0; i < gradientStops.length; i++) {
      const stop = gradientStops[i];
      gradient.addColorStop(stop.offset, stop.color);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, defaultSize, defaultSize);
    this.texture = new Texture({
      source: new ImageSource({
        resource: canvas
      }),
      style: {
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      }
    });
    const { x0, y0, x1, y1 } = this;
    const m = new Matrix();
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    m.translate(-x0, -y0);
    m.scale(1 / defaultSize, 1 / defaultSize);
    m.rotate(-angle);
    m.scale(256 / dist, 1);
    this.transform = m;
  }
};
let FillGradient = _FillGradient;
FillGradient.defaultTextureSize = 256;

export { FillGradient };
//# sourceMappingURL=FillGradient.mjs.map
