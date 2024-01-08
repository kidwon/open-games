'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var BufferResource = require('../../shared/buffer/BufferResource.js');
var UniformGroup = require('../../shared/shader/UniformGroup.js');
var TextureSource = require('../../shared/texture/sources/TextureSource.js');
var TextureStyle = require('../../shared/texture/TextureStyle.js');
var generateProgram = require('./program/generateProgram.js');

const defaultSyncData = {
  textureCount: 0,
  blockIndex: 0
};
class GlShaderSystem {
  constructor(renderer) {
    this.programDataHash = {};
    this.activeProgram = null;
    this.nextIndex = 0;
    this.boundUniformsIdsToIndexHash = {};
    this.boundIndexToUniformsHash = {};
    this.renderer = renderer;
  }
  contextChange(gl) {
    this.gl = gl;
    this.maxBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
  }
  bind(shader, skipSync) {
    this.setProgram(shader.glProgram);
    if (skipSync)
      return;
    defaultSyncData.textureCount = 0;
    defaultSyncData.blockIndex = 0;
    const gl = this.gl;
    const programData = this.getProgramData(shader.glProgram);
    for (const i in shader.groups) {
      const bindGroup = shader.groups[i];
      for (const j in bindGroup.resources) {
        const resource = bindGroup.resources[j];
        if (resource instanceof UniformGroup.UniformGroup) {
          if (resource.ubo) {
            this.bindUniformBlock(
              resource,
              shader.uniformBindMap[i][j],
              defaultSyncData.blockIndex++
            );
          } else {
            this.updateUniformGroup(resource);
          }
        } else if (resource instanceof BufferResource.BufferResource) {
          this.bindUniformBlock(
            resource,
            shader.uniformBindMap[i][j],
            defaultSyncData.blockIndex++
          );
        } else if (resource instanceof TextureSource.TextureSource) {
          this.renderer.texture.bind(resource, defaultSyncData.textureCount);
          const uniformName = shader.uniformBindMap[i][j];
          const uniformData = programData.uniformData[uniformName];
          if (uniformData) {
            gl.uniform1i(uniformData.location, defaultSyncData.textureCount++);
          }
        } else if (resource instanceof TextureStyle.TextureStyle) {
        }
      }
    }
  }
  updateUniformGroup(uniformGroup) {
    this.renderer.uniformGroup.updateUniformGroup(uniformGroup, this.activeProgram, defaultSyncData);
  }
  bindUniformBlock(uniformGroup, name, index = 0) {
    const bufferSystem = this.renderer.buffer;
    const programData = this.getProgramData(this.activeProgram);
    const isBufferResource = uniformGroup.bufferResource;
    if (isBufferResource) {
      this.renderer.uniformBuffer.updateUniformGroup(uniformGroup);
    }
    bufferSystem.updateBuffer(uniformGroup.buffer);
    let boundIndex = this.boundUniformsIdsToIndexHash[uniformGroup.uid];
    if (boundIndex === void 0) {
      const nextIndex = this.nextIndex++ % this.maxBindings;
      const currentBoundUniformGroup = this.boundIndexToUniformsHash[nextIndex];
      if (currentBoundUniformGroup) {
        this.boundUniformsIdsToIndexHash[currentBoundUniformGroup.uid] = void 0;
      }
      boundIndex = this.boundUniformsIdsToIndexHash[uniformGroup.uid] = nextIndex;
      this.boundIndexToUniformsHash[nextIndex] = uniformGroup;
      if (isBufferResource) {
        bufferSystem.bindBufferRange(uniformGroup.buffer, nextIndex, uniformGroup.offset);
      } else {
        bufferSystem.bindBufferBase(uniformGroup.buffer, nextIndex);
      }
    }
    const gl = this.gl;
    const uniformBlockIndex = this.activeProgram.uniformBlockData[name].index;
    if (programData.uniformBlockBindings[index] === boundIndex)
      return;
    programData.uniformBlockBindings[index] = boundIndex;
    gl.uniformBlockBinding(programData.program, uniformBlockIndex, boundIndex);
  }
  setProgram(program) {
    if (this.activeProgram === program)
      return;
    this.activeProgram = program;
    const programData = this.getProgramData(program);
    this.gl.useProgram(programData.program);
  }
  getProgramData(program) {
    const key = program.key;
    return this.programDataHash[key] || this.createProgramData(program);
  }
  createProgramData(program) {
    const key = program.key;
    this.programDataHash[key] = generateProgram.generateProgram(this.gl, program);
    return this.programDataHash[key];
  }
}
/** @ignore */
GlShaderSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "shader"
};

exports.GlShaderSystem = GlShaderSystem;
//# sourceMappingURL=GlShaderSystem.js.map
