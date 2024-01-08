'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Matrix = require('../../../maths/Matrix.js');
var batchSamplersUniformGroup = require('../../renderers/gl/shader/batchSamplersUniformGroup.js');
var Shader = require('../../renderers/shared/shader/Shader.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var _const = require('../shared/const.js');
var generateDefaultBatchGlProgram = require('./generateDefaultBatchGlProgram.js');

class GlBatchAdaptor {
  constructor() {
    this.didUpload = false;
  }
  init() {
    const uniforms = new UniformGroup.UniformGroup({
      tint: { value: new Float32Array([1, 1, 1, 1]), type: "f32" },
      translationMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" }
    });
    this.shader = new Shader.Shader({
      glProgram: generateDefaultBatchGlProgram.generateDefaultBatchGlProgram(_const.MAX_TEXTURES),
      resources: {
        uniforms,
        batchSamplers: batchSamplersUniformGroup.batchSamplersUniformGroup
      }
    });
  }
  execute(batchPipe, batch) {
    const renderer = batchPipe.renderer;
    batchPipe.state.blendMode = batch.blendMode;
    renderer.state.set(batchPipe.state);
    renderer.shader.bind(this.shader, this.didUpload);
    this.didUpload = true;
    const activeBatcher = batch.batchParent;
    renderer.geometry.bind(activeBatcher.geometry, this.shader.glProgram);
    for (let i = 0; i < batch.textures.textures.length; i++) {
      renderer.texture.bind(batch.textures.textures[i], i);
    }
    renderer.shader.bindUniformBlock(renderer.globalUniforms.uniformGroup, "globalUniforms", 0);
    renderer.geometry.draw("triangle-list", batch.size, batch.start);
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GlBatchAdaptor.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipesAdaptor
  ],
  name: "batch"
};

exports.GlBatchAdaptor = GlBatchAdaptor;
//# sourceMappingURL=GlBatchAdaptor.js.map
