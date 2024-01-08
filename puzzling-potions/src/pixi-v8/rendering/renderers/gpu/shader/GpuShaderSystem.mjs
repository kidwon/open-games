import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { UniformGroup } from '../../shared/shader/UniformGroup.mjs';

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
        if (resource instanceof UniformGroup) {
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
    ExtensionType.WebGPUSystem
  ],
  name: "shader"
};

export { GpuShaderSystem };
//# sourceMappingURL=GpuShaderSystem.mjs.map
