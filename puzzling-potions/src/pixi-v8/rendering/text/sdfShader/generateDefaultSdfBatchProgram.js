'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generateBatchProgram = require('../../batcher/gpu/generateBatchProgram.js');
var sdfBatcherTemplate = require('./sdf-batcher-template.js');

function generateDefaultSdfBatchProgram(maxTextures) {
  return generateBatchProgram.generateBatchProgram({
    vertex: {
      source: sdfBatcherTemplate["default"],
      entryPoint: "mainVertex"
    },
    fragment: {
      source: sdfBatcherTemplate["default"],
      entryPoint: "mainFragment"
    },
    maxTextures
  });
}

exports.generateDefaultSdfBatchProgram = generateDefaultSdfBatchProgram;
//# sourceMappingURL=generateDefaultSdfBatchProgram.js.map
