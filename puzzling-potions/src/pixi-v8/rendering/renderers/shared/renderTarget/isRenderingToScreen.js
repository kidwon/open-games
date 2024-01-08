'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isRenderingToScreen(renderTarget) {
  const resource = renderTarget.colorTexture.source.resource;
  return resource instanceof HTMLCanvasElement && document.body.contains(resource);
}

exports.isRenderingToScreen = isRenderingToScreen;
//# sourceMappingURL=isRenderingToScreen.js.map
