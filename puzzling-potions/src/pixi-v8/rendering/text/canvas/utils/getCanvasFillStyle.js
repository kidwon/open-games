'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../../maths/Matrix.js');
var convertNumberToHex = require('../../../../utils/color/convertNumberToHex.js');
var FillGradient = require('../../../graphics/shared/fill/FillGradient.js');
var FillPattern = require('../../../graphics/shared/fill/FillPattern.js');
var Texture = require('../../../renderers/shared/texture/Texture.js');

function getCanvasFillStyle(fillStyle, context) {
  if (fillStyle.texture === Texture.Texture.WHITE && !fillStyle.fill) {
    return convertNumberToHex.convertNumberToHex(fillStyle.color);
  } else if (!fillStyle.fill) {
    const pattern = context.createPattern(fillStyle.texture.source.resource, "repeat");
    const tempMatrix = fillStyle.matrix.copyTo(Matrix.Matrix.shared);
    tempMatrix.scale(fillStyle.texture.frameWidth, fillStyle.texture.frameHeight);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillPattern.FillPattern) {
    const fillPattern = fillStyle.fill;
    const pattern = context.createPattern(fillPattern.texture.source.resource, "repeat");
    const tempMatrix = fillPattern.transform.copyTo(Matrix.Matrix.shared);
    tempMatrix.scale(fillPattern.texture.frameWidth, fillPattern.texture.frameHeight);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillGradient.FillGradient) {
    const fillGradient = fillStyle.fill;
    if (fillGradient.type === "linear") {
      const gradient = context.createLinearGradient(
        fillGradient.x0,
        fillGradient.y0,
        fillGradient.x1,
        fillGradient.y1
      );
      fillGradient.gradientStops.forEach((stop) => {
        gradient.addColorStop(stop.offset, convertNumberToHex.convertNumberToHex(stop.color));
      });
      return gradient;
    }
  }
  console.warn("[PixiJS] FillStyle not recognised", fillStyle);
  return "red";
}

exports.getCanvasFillStyle = getCanvasFillStyle;
//# sourceMappingURL=getCanvasFillStyle.js.map
