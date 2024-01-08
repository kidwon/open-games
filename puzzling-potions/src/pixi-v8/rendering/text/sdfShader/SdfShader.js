'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var _const = require('../../batcher/shared/const.js');
var Filter = require('../../filters/Filter.js');
var batchSamplersUniformGroup = require('../../renderers/gl/shader/batchSamplersUniformGroup.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var generateDefaultSdfBatchGlProgram = require('./generateDefaultSdfBatchGlProgram.js');
var generateDefaultSdfBatchProgram = require('./generateDefaultSdfBatchProgram.js');

class SdfShader extends Filter.Filter {
  constructor() {
    const uniforms = new UniformGroup.UniformGroup({
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      transformMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      distance: { value: 4, type: "f32" }
    });
    super({
      glProgram: generateDefaultSdfBatchGlProgram.generateDefaultSdfBatchGlProgram(_const.MAX_TEXTURES),
      gpuProgram: generateDefaultSdfBatchProgram.generateDefaultSdfBatchProgram(_const.MAX_TEXTURES),
      resources: {
        localUniforms: uniforms,
        batchSamplers: batchSamplersUniformGroup.batchSamplersUniformGroup
      }
    });
  }
}

exports.SdfShader = SdfShader;
//# sourceMappingURL=SdfShader.js.map
