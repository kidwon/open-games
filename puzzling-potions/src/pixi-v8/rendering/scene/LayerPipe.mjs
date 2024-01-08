import { ExtensionType } from '../../extensions/Extensions.mjs';
import { executeInstructions } from './utils/executeInstructions.mjs';

class LayerPipe {
  constructor(renderer) {
    this.renderer = renderer;
  }
  addLayerGroup(layerGroup, instructionSet) {
    this.renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add(layerGroup);
  }
  execute(layerGroup) {
    if (!layerGroup.isRenderable)
      return;
    this.renderer.globalUniforms.push({
      projectionMatrix: this.renderer.renderTarget.renderTarget.projectionMatrix,
      worldTransformMatrix: layerGroup.worldTransform,
      worldColor: layerGroup.worldColor
    });
    executeInstructions(layerGroup, this.renderer.renderPipes);
    this.renderer.globalUniforms.pop();
  }
  destroy() {
    this.renderer = null;
  }
}
LayerPipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "layer"
};

export { LayerPipe };
//# sourceMappingURL=LayerPipe.mjs.map
