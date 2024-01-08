import { mixHexColors } from './mixHexColors.mjs';

const WHITE_WHITE = 16777215 + (16777215 << 32);
function mixColors(localColor, parentColor) {
  const localAlpha = (localColor >> 24 & 255) / 255;
  const parentAlpha = (parentColor >> 24 & 255) / 255;
  const globalAlpha = localAlpha * parentAlpha * 255;
  const localBGRColor = localColor & 16777215;
  const parentBGRColor = parentColor & 16777215;
  let sharedBGRColor = 16777215;
  if (localBGRColor + (parentBGRColor << 32) !== WHITE_WHITE) {
    if (localBGRColor === 16777215) {
      sharedBGRColor = parentBGRColor;
    } else if (parentBGRColor === 16777215) {
      sharedBGRColor = localBGRColor;
    } else {
      sharedBGRColor = mixHexColors(localBGRColor, parentBGRColor, 0.5);
    }
  }
  return sharedBGRColor + (globalAlpha << 24);
}
function mixStandardAnd32BitColors(localColorRGB, localAlpha, parentColor) {
  const parentAlpha = (parentColor >> 24 & 255) / 255;
  const globalAlpha = localAlpha * parentAlpha * 255;
  const localBGRColor = ((localColorRGB & 255) << 16) + (localColorRGB & 65280) + (localColorRGB >> 16 & 255);
  const parentBGRColor = parentColor & 16777215;
  let sharedBGRColor = 16777215;
  if (localBGRColor + (parentBGRColor << 32) !== WHITE_WHITE) {
    if (localBGRColor === 16777215) {
      sharedBGRColor = parentBGRColor;
    } else if (parentBGRColor === 16777215) {
      sharedBGRColor = localBGRColor;
    } else {
      sharedBGRColor = mixHexColors(localBGRColor, parentBGRColor, 0.5);
    }
  }
  return sharedBGRColor + (globalAlpha << 24);
}

export { mixColors, mixStandardAnd32BitColors };
//# sourceMappingURL=mixColors.mjs.map
