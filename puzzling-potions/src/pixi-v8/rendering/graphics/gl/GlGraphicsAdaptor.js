'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Matrix = require('../../../maths/Matrix.js');
var _const = require('../../batcher/shared/const.js');
var batchSamplersUniformGroup = require('../../renderers/gl/shader/batchSamplersUniformGroup.js');
var Shader = require('../../renderers/shared/shader/Shader.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var colorToUniform = require('../gpu/colorToUniform.js');
var generateDefaultGraphicsBatchGlProgram = require('./generateDefaultGraphicsBatchGlProgram.js');

class GlGraphicsAdaptor {
  init() {
    const uniforms = new UniformGroup.UniformGroup({
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      transformMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" }
    });
    this.shader = new Shader.Shader({
      glProgram: generateDefaultGraphicsBatchGlProgram.generateDefaultGraphicsBatchGlProgram(_const.MAX_TEXTURES),
      resources: {
        localUniforms: uniforms,
        batchSamplers: batchSamplersUniformGroup.batchSamplersUniformGroup
      }
    });
  }
  execute(graphicsPipe, renderable) {
    const context = renderable.view.context;
    const shader = context.customShader || this.shader;
    const renderer = graphicsPipe.renderer;
    const contextSystem = renderer.graphicsContext;
    if (!contextSystem.updateGpuContext(context).batches.length) {
      return;
    }
    const {
      geometry,
      batches
    } = contextSystem.getContextRenderData(context);
    const state = graphicsPipe.state;
    state.blendMode = renderable.layerBlendMode;
    renderer.state.set(graphicsPipe.state);
    const localUniforms = shader.resources.localUniforms.uniforms;
    localUniforms.transformMatrix = renderable.layerTransform;
    colorToUniform.color32BitToUniform(
      renderable.layerColor,
      localUniforms.color,
      0
    );
    renderer.shader.bind(shader);
    renderer.shader.bindUniformBlock(renderer.globalUniforms.uniformGroup, "globalUniforms");
    renderer.geometry.bind(geometry, shader.glProgram);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (batch.size) {
        for (let j = 0; j < batch.textures.textures.length; j++) {
          renderer.texture.bind(batch.textures.textures[j], j);
        }
        renderer.geometry.draw("triangle-list", batch.size, batch.start);
      }
    }
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GlGraphicsAdaptor.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipesAdaptor
  ],
  name: "graphics"
};

exports.GlGraphicsAdaptor = GlGraphicsAdaptor;
//# sourceMappingURL=GlGraphicsAdaptor.js.map
