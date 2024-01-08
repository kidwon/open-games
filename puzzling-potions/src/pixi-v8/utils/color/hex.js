'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function hex2rgb(hex, out = []) {
  out[0] = (hex >> 16 & 255) / 255;
  out[1] = (hex >> 8 & 255) / 255;
  out[2] = (hex & 255) / 255;
  return out;
}
function hex2string(hex) {
  let hexString = hex.toString(16);
  hexString = "000000".substring(0, 6 - hexString.length) + hexString;
  return `#${hexString}`;
}
function string2hex(string) {
  if (typeof string === "string") {
    if (string[0] === "#") {
      string = string.slice(1);
    }
  }
  return parseInt(string, 16);
}
function rgb2hex(rgb) {
  return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + (rgb[2] * 255 | 0);
}

exports.hex2rgb = hex2rgb;
exports.hex2string = hex2string;
exports.rgb2hex = rgb2hex;
exports.string2hex = string2hex;
//# sourceMappingURL=hex.js.map
