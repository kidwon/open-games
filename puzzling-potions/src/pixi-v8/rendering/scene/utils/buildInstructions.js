'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LayerRenderable = require('../../renderers/shared/LayerRenderable.js');

function buildInstructions(layerGroup, renderPipes) {
  const root = layerGroup.root;
  const instructionSet = layerGroup.instructionSet;
  instructionSet.reset();
  renderPipes.batch.buildStart(instructionSet);
  renderPipes.blendMode.buildStart();
  renderPipes.colorMask.buildStart();
  if (layerGroup.root.view) {
    const proxyRenderable = layerGroup.proxyRenderable ?? initProxyRenderable(layerGroup);
    if (proxyRenderable) {
      renderPipes.blendMode.setBlendMode(proxyRenderable, proxyRenderable.layerBlendMode, instructionSet);
      renderPipes[proxyRenderable.view.type].addRenderable(proxyRenderable, instructionSet);
    }
  }
  if (root.sortChildren) {
    root.sortChildrenDepth();
  }
  const children = root.children;
  const length = children.length;
  for (let i = 0; i < length; i++) {
    collectAllRenderables(children[i], instructionSet, renderPipes);
  }
  renderPipes.batch.buildEnd(instructionSet);
  renderPipes.blendMode.buildEnd(instructionSet);
}
function collectAllRenderables(container, instructionSet, rendererPipes) {
  if (container.layerVisibleRenderable < 3 || !container.includeInBuild)
    return;
  if (container.sortChildren) {
    container.sortChildrenDepth();
  }
  if (container.isSimple) {
    collectAllRenderablesSimple(container, instructionSet, rendererPipes);
  } else {
    collectAllRenderablesAdvanced(container, instructionSet, rendererPipes);
  }
}
function collectAllRenderablesSimple(container, instructionSet, renderPipes) {
  const view = container.view;
  if (view) {
    renderPipes.blendMode.setBlendMode(container, container.layerBlendMode, instructionSet);
    container.didViewUpdate = false;
    const rp = renderPipes;
    rp[view.type].addRenderable(container, instructionSet);
  }
  if (!container.isLayerRoot) {
    const children = container.children;
    const length = children.length;
    for (let i = 0; i < length; i++) {
      collectAllRenderables(children[i], instructionSet, renderPipes);
    }
  }
}
function collectAllRenderablesAdvanced(container, instructionSet, renderPipes) {
  for (let i = 0; i < container.effects.length; i++) {
    const effect = container.effects[i];
    renderPipes[effect.pipe].push(effect, container, instructionSet);
  }
  if (container.isLayerRoot) {
    renderPipes.layer.addLayerGroup(container.layerGroup, instructionSet);
  } else {
    const view = container.view;
    if (view) {
      renderPipes.blendMode.setBlendMode(container, container.layerBlendMode, instructionSet);
      container.didViewUpdate = false;
      renderPipes[view.type].addRenderable(container, instructionSet);
    }
    const children = container.children;
    if (children.length) {
      for (let i = 0; i < children.length; i++) {
        collectAllRenderables(children[i], instructionSet, renderPipes);
      }
    }
  }
  for (let i = container.effects.length - 1; i >= 0; i--) {
    const effect = container.effects[i];
    renderPipes[effect.pipe].pop(effect, container, instructionSet);
  }
}
function initProxyRenderable(layerGroup) {
  const root = layerGroup.root;
  if (root.view) {
    layerGroup.proxyRenderable = new LayerRenderable.LayerRenderable({
      original: root,
      view: root.view
    });
  }
}

exports.buildInstructions = buildInstructions;
exports.collectAllRenderables = collectAllRenderables;
//# sourceMappingURL=buildInstructions.js.map
