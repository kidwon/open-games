'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generateBatchProgram = require('../../batcher/gpu/generateBatchProgram.js');
var graphicsBatcherTemplate = require('./graphics-batcher-template.js');

function generateDefaultGraphicsBatchProgram(maxTextures) {
  return generateBatchProgram.generateBatchProgram({
    vertex: {
      source: graphicsBatcherTemplate["default"],
      entryPoint: "mainVertex"
    },
    fragment: {
      source: graphicsBatcherTemplate["default"],
      entryPoint: "mainFragment"
    },
    maxTextures
  });
}

exports.generateDefaultGraphicsBatchProgram = generateDefaultGraphicsBatchProgram;
//# sourceMappingURL=generateDefaultGraphicsBatchProgram.js.map
