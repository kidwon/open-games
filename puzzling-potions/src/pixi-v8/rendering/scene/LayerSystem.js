'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../extensions/Extensions.js');
var buildInstructions = require('./utils/buildInstructions.js');
var collectLayerGroups = require('./utils/collectLayerGroups.js');
var executeInstructions = require('./utils/executeInstructions.js');
var updateLayerGroupTransforms = require('./utils/updateLayerGroupTransforms.js');
var validateRenderables = require('./utils/validateRenderables.js');

class LayerSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  render({ container }) {
    container.layer = true;
    const renderer = this.renderer;
    const layerGroups = collectLayerGroups.collectLayerGroups(container.layerGroup, []);
    const renderPipes = renderer.renderPipes;
    for (let i = 0; i < layerGroups.length; i++) {
      const layerGroup = layerGroups[i];
      layerGroup.runOnRender();
      layerGroup.instructionSet.renderPipes = renderPipes;
      if (!layerGroup.structureDidChange) {
        validateRenderables.validateRenderables(layerGroup, renderPipes);
      }
      updateLayerGroupTransforms.updateLayerGroupTransforms(layerGroup);
      if (layerGroup.structureDidChange) {
        layerGroup.structureDidChange = false;
        buildInstructions.buildInstructions(layerGroup, renderPipes);
      } else {
        updateThings(layerGroup);
      }
      renderer.renderPipes.batch.upload(layerGroup.instructionSet);
    }
    renderer.globalUniforms.start(
      {
        projectionMatrix: renderer.renderTarget.rootProjectionMatrix,
        worldTransformMatrix: container.layerGroup.worldTransform
      }
    );
    executeInstructions.executeInstructions(container.layerGroup, renderPipes);
    if (renderPipes.uniformBatch) {
      renderPipes.uniformBatch.renderEnd();
      renderPipes.uniformBuffer.renderEnd();
    }
  }
  destroy() {
  }
}
/** @ignore */
LayerSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "layer"
};
function updateThings(layerGroup) {
  const { list, index } = layerGroup.childrenRenderablesToUpdate;
  for (let i = 0; i < index; i++) {
    const container = list[i];
    if (container.didViewUpdate) {
      layerGroup.updateRenderable(container);
    }
  }
  layerGroup.childrenRenderablesToUpdate.index = 0;
}

exports.LayerSystem = LayerSystem;
//# sourceMappingURL=LayerSystem.js.map
