import { Matrix } from '../../../../maths/Matrix.mjs';
import { convertColorToNumber } from '../../../../utils/color/convertColorToNumber.mjs';
import { Texture } from '../../../renderers/shared/texture/Texture.mjs';
import { FillGradient } from '../fill/FillGradient.mjs';
import { FillPattern } from '../fill/FillPattern.mjs';

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
      color: convertColorToNumber(styleToMerge),
      texture: Texture.WHITE
    };
  } else if (styleToMerge instanceof FillPattern) {
    const pattern = styleToMerge;
    return {
      ...fillStyleToParse,
      color: 16777215,
      texture: pattern.texture,
      matrix: pattern.transform
    };
  } else if (styleToMerge instanceof FillGradient) {
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
  if (style.texture !== Texture.WHITE) {
    const m = style.matrix || new Matrix();
    m.scale(
      1 / style.texture.frameWidth,
      1 / style.texture.frameHeight
    );
    style.matrix = m;
    style.color = 16777215;
  }
  style.color = convertColorToNumber(style.color);
  return style;
}

export { convertFillInputToFillStyle };
//# sourceMappingURL=convertFillInputToFillStyle.mjs.map
