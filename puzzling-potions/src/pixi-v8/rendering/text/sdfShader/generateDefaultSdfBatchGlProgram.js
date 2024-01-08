'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generateBatchGlProgram = require('../../batcher/gl/generateBatchGlProgram.js');
var sdfBatcherTemplate$1 = require('./sdf-batcher-template3.js');
var sdfBatcherTemplate = require('./sdf-batcher-template2.js');

function generateDefaultSdfBatchGlProgram(maxTextures) {
  return generateBatchGlProgram.generateBatchGlProgram({
    vertexSrc: sdfBatcherTemplate["default"],
    fragmentSrc: sdfBatcherTemplate$1["default"],
    maxTextures,
    name: "sdf"
  });
}

exports.generateDefaultSdfBatchGlProgram = generateDefaultSdfBatchGlProgram;
//# sourceMappingURL=generateDefaultSdfBatchGlProgram.js.map
