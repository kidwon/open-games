'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getTextureDefaultMatrix(texture, out) {
  const { frameWidth, frameHeight } = texture;
  out.scale(1 / frameWidth, 1 / frameHeight);
  return out;
}

exports.getTextureDefaultMatrix = getTextureDefaultMatrix;
//# sourceMappingURL=getTextureDefaultMatrix.js.map
