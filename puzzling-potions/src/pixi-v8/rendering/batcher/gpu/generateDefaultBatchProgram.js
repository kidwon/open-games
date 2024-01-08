'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var batcherTemplate = require('./batcher-template.js');
var generateBatchProgram = require('./generateBatchProgram.js');

function generateDefaultBatchProgram(maxTextures) {
  return generateBatchProgram.generateBatchProgram({
    vertex: {
      source: batcherTemplate["default"],
      entryPoint: "mainVertex"
    },
    fragment: {
      source: batcherTemplate["default"],
      entryPoint: "mainFragment"
    },
    maxTextures
  });
}

exports.generateDefaultBatchProgram = generateDefaultBatchProgram;
//# sourceMappingURL=generateDefaultBatchProgram.js.map
