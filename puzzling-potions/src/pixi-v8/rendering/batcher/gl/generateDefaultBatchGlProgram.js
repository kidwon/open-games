'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var batcherTemplate$1 = require('./batcher-template2.js');
var batcherTemplate = require('./batcher-template.js');
var generateBatchGlProgram = require('./generateBatchGlProgram.js');

function generateDefaultBatchGlProgram(maxTextures) {
  return generateBatchGlProgram.generateBatchGlProgram({
    vertexSrc: batcherTemplate["default"],
    fragmentSrc: batcherTemplate$1["default"],
    maxTextures,
    name: "default"
  });
}

exports.generateDefaultBatchGlProgram = generateDefaultBatchGlProgram;
//# sourceMappingURL=generateDefaultBatchGlProgram.js.map
