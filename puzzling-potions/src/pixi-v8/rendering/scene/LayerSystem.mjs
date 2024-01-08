import { ExtensionType } from '../../extensions/Extensions.mjs';
import { buildInstructions } from './utils/buildInstructions.mjs';
import { collectLayerGroups } from './utils/collectLayerGroups.mjs';
import { executeInstructions } from './utils/executeInstructions.mjs';
import { updateLayerGroupTransforms } from './utils/updateLayerGroupTransforms.mjs';
import { validateRenderables } from './utils/validateRenderables.mjs';

class LayerSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  render({ container }) {
    container.layer = true;
    const renderer = this.renderer;
    const layerGroups = collectLayerGroups(container.layerGroup, []);
    const renderPipes = renderer.renderPipes;
    for (let i = 0; i < layerGroups.length; i++) {
      const layerGroup = layerGroups[i];
      layerGroup.runOnRender();
      layerGroup.instructionSet.renderPipes = renderPipes;
      if (!layerGroup.structureDidChange) {
        validateRenderables(layerGroup, renderPipes);
      }
      updateLayerGroupTransforms(layerGroup);
      if (layerGroup.structureDidChange) {
        layerGroup.structureDidChange = false;
        buildInstructions(layerGroup, renderPipes);
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
    executeInstructions(container.layerGroup, renderPipes);
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
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
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

export { LayerSystem };
//# sourceMappingURL=LayerSystem.mjs.map
