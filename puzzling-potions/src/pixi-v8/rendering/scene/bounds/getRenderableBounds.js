'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getGlobalRenderableBounds(renderables, bounds) {
  bounds.clear();
  const tempMatrix = bounds.matrix;
  for (let i = 0; i < renderables.length; i++) {
    const renderable = renderables[i];
    if (renderable.layerVisibleRenderable < 3) {
      continue;
    }
    bounds.matrix = renderable.worldTransform;
    renderable.view.addBounds(bounds);
  }
  bounds.matrix = tempMatrix;
  return bounds;
}

exports.getGlobalRenderableBounds = getGlobalRenderableBounds;
//# sourceMappingURL=getRenderableBounds.js.map
