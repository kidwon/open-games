'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function colorToUniform(rgb, alpha, out, offset) {
  out[offset++] = (rgb >> 16 & 255) / 255;
  out[offset++] = (rgb >> 8 & 255) / 255;
  out[offset++] = (rgb & 255) / 255;
  out[offset++] = alpha;
}
function color32BitToUniform(abgr, out, offset) {
  out[offset++] = (abgr & 255) / 255;
  out[offset++] = (abgr >> 8 & 255) / 255;
  out[offset++] = (abgr >> 16 & 255) / 255;
  out[offset++] = (abgr >> 24 & 255) / 255;
}

exports.color32BitToUniform = color32BitToUniform;
exports.colorToUniform = colorToUniform;
//# sourceMappingURL=colorToUniform.js.map
