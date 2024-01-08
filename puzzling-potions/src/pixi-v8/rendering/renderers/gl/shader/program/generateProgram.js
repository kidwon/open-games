'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GlProgramData = require('../GlProgramData.js');
var compileShader = require('./compileShader.js');
var defaultValue = require('./defaultValue.js');
var getAttributeData = require('./getAttributeData.js');
var getUniformBufferData = require('./getUniformBufferData.js');
var getUniformData = require('./getUniformData.js');
var logProgramError = require('./logProgramError.js');

function generateProgram(gl, program) {
  const glVertShader = compileShader.compileShader(gl, gl.VERTEX_SHADER, program.vertex);
  const glFragShader = compileShader.compileShader(gl, gl.FRAGMENT_SHADER, program.fragment);
  const webGLProgram = gl.createProgram();
  gl.attachShader(webGLProgram, glVertShader);
  gl.attachShader(webGLProgram, glFragShader);
  const transformFeedbackVaryings = program.transformFeedbackVaryings;
  if (transformFeedbackVaryings) {
    if (typeof gl.transformFeedbackVaryings !== "function") {
      console.warn(`TransformFeedback is not supported but TransformFeedbackVaryings are given.`);
    } else {
      gl.transformFeedbackVaryings(
        webGLProgram,
        transformFeedbackVaryings.names,
        transformFeedbackVaryings.bufferMode === "separate" ? gl.SEPARATE_ATTRIBS : gl.INTERLEAVED_ATTRIBS
      );
    }
  }
  gl.linkProgram(webGLProgram);
  if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
    logProgramError.logProgramError(gl, webGLProgram, glVertShader, glFragShader);
  }
  program.attributeData = getAttributeData.getAttributeData(webGLProgram, gl);
  program.uniformData = getUniformData.getUniformData(webGLProgram, gl);
  program.uniformBlockData = getUniformBufferData.getUniformBufferData(webGLProgram, gl);
  gl.deleteShader(glVertShader);
  gl.deleteShader(glFragShader);
  const uniformData = {};
  for (const i in program.uniformData) {
    const data = program.uniformData[i];
    uniformData[i] = {
      location: gl.getUniformLocation(webGLProgram, i),
      value: defaultValue.defaultValue(data.type, data.size)
    };
  }
  const glProgram = new GlProgramData.GlProgramData(webGLProgram, uniformData);
  return glProgram;
}

exports.generateProgram = generateProgram;
//# sourceMappingURL=generateProgram.js.map
