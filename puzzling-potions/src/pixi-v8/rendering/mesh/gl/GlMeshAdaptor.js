'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var colorToUniform = require('../../graphics/gpu/colorToUniform.js');

class GlMeshAdaptor {
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
      shader.texture = view.texture;
    }
    shader.groups[0] = renderer.globalUniforms.bindGroup;
    shader.groups[1] = meshPipe.localUniformsBindGroup;
    renderer.encoder.draw({
      geometry: view._geometry,
      shader,
      state
    });
  }
}
GlMeshAdaptor.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipesAdaptor
  ],
  name: "mesh"
};

exports.GlMeshAdaptor = GlMeshAdaptor;
//# sourceMappingURL=GlMeshAdaptor.js.map
