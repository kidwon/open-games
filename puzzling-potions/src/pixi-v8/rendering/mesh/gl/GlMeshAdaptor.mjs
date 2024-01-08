import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { color32BitToUniform } from '../../graphics/gpu/colorToUniform.mjs';

class GlMeshAdaptor {
  execute(meshPipe, renderable) {
    const renderer = meshPipe.renderer;
    const view = renderable.view;
    const state = meshPipe.state;
    state.blendMode = renderable.layerBlendMode;
    const localUniforms = meshPipe.localUniforms;
    localUniforms.uniforms.transformMatrix = renderable.layerTransform;
    localUniforms.update();
    color32BitToUniform(
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
    ExtensionType.WebGLPipesAdaptor
  ],
  name: "mesh"
};

export { GlMeshAdaptor };
//# sourceMappingURL=GlMeshAdaptor.mjs.map
