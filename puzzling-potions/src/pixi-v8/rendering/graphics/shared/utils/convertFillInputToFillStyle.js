'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../../maths/Matrix.js');
var convertColorToNumber = require('../../../../utils/color/convertColorToNumber.js');
var Texture = require('../../../renderers/shared/texture/Texture.js');
var FillGradient = require('../fill/FillGradient.js');
var FillPattern = require('../fill/FillPattern.js');

function convertFillInputToFillStyle(value, defaultStyle) {
  if (!value) {
    return null;
  }
  let fillStyleToParse;
  let styleToMerge;
  if (value?.fill) {
    styleToMerge = value.fill;
    fillStyleToParse = { ...defaultStyle, ...value };
  } else {
    styleToMerge = value;
    fillStyleToParse = defaultStyle;
  }
  if (typeof styleToMerge === "number" || typeof styleToMerge === "string") {
    return {
      ...fillStyleToParse,
      color: convertColorToNumber.convertColorToNumber(styleToMerge),
      texture: Texture.Texture.WHITE
    };
  } else if (styleToMerge instanceof FillPattern.FillPattern) {
    const pattern = styleToMerge;
    return {
      ...fillStyleToParse,
      color: 16777215,
      texture: pattern.texture,
      matrix: pattern.transform
    };
  } else if (styleToMerge instanceof FillGradient.FillGradient) {
    const gradient = styleToMerge;
    gradient.buildLinearGradient();
    return {
      ...fillStyleToParse,
      color: 16777215,
      texture: gradient.texture,
      matrix: gradient.transform
    };
  }
  const style = { ...defaultStyle, ...value };
  if (style.texture !== Texture.Texture.WHITE) {
    const m = style.matrix || new Matrix.Matrix();
    m.scale(
      1 / style.texture.frameWidth,
      1 / style.texture.frameHeight
    );
    style.matrix = m;
    style.color = 16777215;
  }
  style.color = convertColorToNumber.convertColorToNumber(style.color);
  return style;
}

exports.convertFillInputToFillStyle = convertFillInputToFillStyle;
//# sourceMappingURL=convertFillInputToFillStyle.js.map
