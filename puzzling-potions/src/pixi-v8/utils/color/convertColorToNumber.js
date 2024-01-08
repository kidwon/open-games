'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ColorNames = require('./ColorNames.js');

function convertColorToNumber(color) {
  if (typeof color === "number") {
    return color;
  }
  if (typeof color === "string") {
    if (ColorNames.ColorNames[color] !== void 0) {
      return ColorNames.ColorNames[color];
    } else if (color[0] === "#") {
      if (color.length === 4) {
        const r = parseInt(color[1] + color[1], 16);
        const g = parseInt(color[2] + color[2], 16);
        const b = parseInt(color[3] + color[3], 16);
        return (r << 16) + (g << 8) + b;
      }
      return parseInt(color.substring(1), 16);
    }
    console.warn(`[pixi.js] Invalid color: ${color}`);
  }
  return 0;
}

exports.convertColorToNumber = convertColorToNumber;
//# sourceMappingURL=convertColorToNumber.js.map
