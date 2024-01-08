'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var CanvasSource = require('../sources/CanvasSource.js');
var Texture = require('../Texture.js');

const canvasCache = /* @__PURE__ */ new Map();
function getCanvasTexture(canvas, options) {
  if (!canvasCache.has(canvas)) {
    const texture = new Texture.Texture({
      source: new CanvasSource.CanvasSource({
        resource: canvas,
        ...options
      })
    });
    canvasCache.set(canvas, texture);
  }
  return canvasCache.get(canvas);
}

exports.getCanvasTexture = getCanvasTexture;
//# sourceMappingURL=getCanvasTexture.js.map
