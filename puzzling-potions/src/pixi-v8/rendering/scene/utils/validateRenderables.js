'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function validateRenderables(layerGroup, renderPipes) {
  const { list, index } = layerGroup.childrenRenderablesToUpdate;
  let rebuildRequired = false;
  for (let i = 0; i < index; i++) {
    const container = list[i];
    const renderable = container.view;
    rebuildRequired = renderPipes[renderable.type].validateRenderable(container);
    if (rebuildRequired) {
      break;
    }
  }
  layerGroup.structureDidChange = rebuildRequired;
  if (rebuildRequired) {
    layerGroup.childrenRenderablesToUpdate.index = 0;
  }
  return rebuildRequired;
}

exports.validateRenderables = validateRenderables;
//# sourceMappingURL=validateRenderables.js.map
