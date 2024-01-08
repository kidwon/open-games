import { CanvasSource } from '../sources/CanvasSource.mjs';
import { Texture } from '../Texture.mjs';

const canvasCache = /* @__PURE__ */ new Map();
function getCanvasTexture(canvas, options) {
  if (!canvasCache.has(canvas)) {
    const texture = new Texture({
      source: new CanvasSource({
        resource: canvas,
        ...options
      })
    });
    canvasCache.set(canvas, texture);
  }
  return canvasCache.get(canvas);
}

export { getCanvasTexture };
//# sourceMappingURL=getCanvasTexture.mjs.map
