'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var UniformGroup = require('../../shared/shader/UniformGroup.js');

class GpuShaderSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  createProgramLayout(program) {
    const device = this.gpu.device;
    if (!program._gpuLayout) {
      if (program.gpuLayout) {
        const bindGroups = program.gpuLayout.map((group) => device.createBindGroupLayout({ entries: group }));
        const pipelineLayoutDesc = { bindGroupLayouts: bindGroups };
        program._gpuLayout = {
          bindGroups,
          pipeline: device.createPipelineLayout(pipelineLayoutDesc)
        };
      } else {
        program._gpuLayout = {
          bindGroups: null,
          pipeline: "auto"
        };
      }
    }
  }
  updateData(shader) {
    for (let i = 0; i < shader.gpuProgram.layout.length; i++) {
      const group = shader.groups[i];
      const groupLayout = shader.gpuProgram.layout[i];
      for (const j in groupLayout) {
        const resource = group.resources[j] ?? group.resources[groupLayout[j]];
        if (resource instanceof UniformGroup.UniformGroup) {
          const uniformGroup = resource;
          this.renderer.uniformBuffer.updateUniformGroup(uniformGroup);
        }
      }
    }
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
GpuShaderSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "shader"
};

exports.GpuShaderSystem = GpuShaderSystem;
//# sourceMappingURL=GpuShaderSystem.js.map
