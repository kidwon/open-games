import { Matrix } from '../../../../maths/Matrix.mjs';
import { convertNumberToHex } from '../../../../utils/color/convertNumberToHex.mjs';
import { FillGradient } from '../../../graphics/shared/fill/FillGradient.mjs';
import { FillPattern } from '../../../graphics/shared/fill/FillPattern.mjs';
import { Texture } from '../../../renderers/shared/texture/Texture.mjs';

function getCanvasFillStyle(fillStyle, context) {
  if (fillStyle.texture === Texture.WHITE && !fillStyle.fill) {
    return convertNumberToHex(fillStyle.color);
  } else if (!fillStyle.fill) {
    const pattern = context.createPattern(fillStyle.texture.source.resource, "repeat");
    const tempMatrix = fillStyle.matrix.copyTo(Matrix.shared);
    tempMatrix.scale(fillStyle.texture.frameWidth, fillStyle.texture.frameHeight);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillPattern) {
    const fillPattern = fillStyle.fill;
    const pattern = context.createPattern(fillPattern.texture.source.resource, "repeat");
    const tempMatrix = fillPattern.transform.copyTo(Matrix.shared);
    tempMatrix.scale(fillPattern.texture.frameWidth, fillPattern.texture.frameHeight);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillGradient) {
    const fillGradient = fillStyle.fill;
    if (fillGradient.type === "linear") {
      const gradient = context.createLinearGradient(
        fillGradient.x0,
        fillGradient.y0,
        fillGradient.x1,
        fillGradient.y1
      );
      fillGradient.gradientStops.forEach((stop) => {
        gradient.addColorStop(stop.offset, convertNumberToHex(stop.color));
      });
      return gradient;
    }
  }
  console.warn("[PixiJS] FillStyle not recognised", fillStyle);
  return "red";
}

export { getCanvasFillStyle };
//# sourceMappingURL=getCanvasFillStyle.mjs.map
