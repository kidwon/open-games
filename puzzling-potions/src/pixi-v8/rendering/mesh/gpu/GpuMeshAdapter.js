'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var colorToUniform = require('../../graphics/gpu/colorToUniform.js');

class GpuMeshAdapter {
  execute(meshPipe, renderable) {
    const renderer = meshPipe.renderer;
    const view = renderable.view;
    const state = meshPipe.state;
    state.blendMode = renderable.layerBlendMode;
    const localUniforms = meshPipe.localUniforms;
    localUniforms.uniforms.transformMatrix = renderable.layerTransform;
    localUniforms.update();
    colorToUniform.color32BitToUniform(
      renderable.layerColor,
      localUniforms.uniforms.color,
      0
    );
    let shader = view._shader;
    if (!shader) {
      shader = meshPipe.meshShader;
      shader.groups[2] = renderer.texture.getTextureBindGroup(view.texture);
    }
    shader.groups[0] = renderer.globalUniforms.bindGroup;
    shader.groups[1] = renderer.renderPipes.uniformBatch.getUniformBindGroup(localUniforms, true);
    renderer.encoder.draw({
      geometry: view._geometry,
      shader,
      state
    });
  }
}
/** @ignore */
GpuMeshAdapter.extension = {
  type: [
    Extensions.ExtensionType.WebGPUPipesAdaptor
  ],
  name: "mesh"
};

exports.GpuMeshAdapter = GpuMeshAdapter;
//# sourceMappingURL=GpuMeshAdapter.js.map
