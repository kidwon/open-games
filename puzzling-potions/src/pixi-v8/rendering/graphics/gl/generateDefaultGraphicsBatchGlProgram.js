'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generateBatchGlProgram = require('../../batcher/gl/generateBatchGlProgram.js');
var graphicsBatcherTemplate$1 = require('./graphics-batcher-template.js');
var graphicsBatcherTemplate = require('./graphics-batcher-template2.js');

function generateDefaultGraphicsBatchGlProgram(maxTextures) {
  return generateBatchGlProgram.generateBatchGlProgram({
    vertexSrc: graphicsBatcherTemplate["default"],
    fragmentSrc: graphicsBatcherTemplate$1["default"],
    maxTextures,
    name: "graphics"
  });
}

exports.generateDefaultGraphicsBatchGlProgram = generateDefaultGraphicsBatchGlProgram;
//# sourceMappingURL=generateDefaultGraphicsBatchGlProgram.js.map
