'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../extensions/Extensions.js');
var executeInstructions = require('./utils/executeInstructions.js');

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
    executeInstructions.executeInstructions(layerGroup, this.renderer.renderPipes);
    this.renderer.globalUniforms.pop();
  }
  destroy() {
    this.renderer = null;
  }
}
LayerPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "layer"
};

exports.LayerPipe = LayerPipe;
//# sourceMappingURL=LayerPipe.js.map
