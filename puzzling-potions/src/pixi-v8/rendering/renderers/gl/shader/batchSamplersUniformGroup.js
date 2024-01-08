'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _const = require('../../../batcher/shared/const.js');
var UniformGroup = require('../../shared/shader/UniformGroup.js');

const sampleValues = new Int32Array(_const.MAX_TEXTURES);
for (let i = 0; i < _const.MAX_TEXTURES; i++) {
  sampleValues[i] = i;
}
const batchSamplersUniformGroup = new UniformGroup.UniformGroup({
  uSamplers: { value: sampleValues, type: `array<u32,${_const.MAX_TEXTURES}>` }
}, { isStatic: true });

exports.batchSamplersUniformGroup = batchSamplersUniformGroup;
//# sourceMappingURL=batchSamplersUniformGroup.js.map
