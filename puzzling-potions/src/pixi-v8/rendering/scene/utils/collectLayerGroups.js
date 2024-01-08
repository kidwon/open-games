'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function collectLayerGroups(renderGroup, out = []) {
  out.push(renderGroup);
  for (let i = 0; i < renderGroup.layerGroupChildren.length; i++) {
    collectLayerGroups(renderGroup.layerGroupChildren[i], out);
  }
  return out;
}

exports.collectLayerGroups = collectLayerGroups;
//# sourceMappingURL=collectLayerGroups.js.map
