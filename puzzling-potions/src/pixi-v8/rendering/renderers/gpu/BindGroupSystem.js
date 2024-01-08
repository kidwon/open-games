'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');

class BindGroupSystem {
  // TODO implement a way to tidy up unused bind groups!
  // private bindGroupCount = 0;
  constructor(renderer) {
    this.hash = {};
    this.renderer = renderer;
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  getBindGroup(bindGroup, program, groupIndex) {
    bindGroup.updateKey();
    const gpuBindGroup = this.hash[bindGroup.key] || this.createBindGroup(bindGroup, program, groupIndex);
    return gpuBindGroup;
  }
  createBindGroup(group, program, groupIndex) {
    const device = this.gpu.device;
    const groupLayout = program.layout[groupIndex];
    const entries = [];
    for (const j in groupLayout) {
      const resource = group.resources[j] ?? group.resources[groupLayout[j]];
      let gpuResource;
      if (resource.resourceType === "uniformGroup") {
        const uniformGroup = resource;
        this.renderer.uniformBuffer.updateUniformGroup(uniformGroup);
        const buffer = uniformGroup.buffer;
        gpuResource = {
          buffer: this.renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size
        };
      } else if (resource.resourceType === "buffer") {
        const buffer = resource;
        gpuResource = {
          buffer: this.renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size
        };
      } else if (resource.resourceType === "bufferResource") {
        const bufferResource = resource;
        gpuResource = {
          buffer: this.renderer.buffer.getGPUBuffer(bufferResource.buffer),
          offset: bufferResource.offset,
          size: bufferResource.size
        };
      } else if (resource.resourceType === "textureSampler") {
        const sampler = resource;
        gpuResource = this.renderer.texture.getGpuSampler(sampler);
      } else if (resource.resourceType === "textureSource") {
        const texture = resource;
        gpuResource = this.renderer.texture.getGpuSource(texture).createView({});
      }
      entries.push({
        binding: groupLayout[j],
        resource: gpuResource
      });
    }
    const gpuBindGroup = device.createBindGroup({
      layout: program._gpuLayout.bindGroups[groupIndex],
      entries
    });
    this.hash[group.key] = gpuBindGroup;
    return gpuBindGroup;
  }
  destroy() {
  }
}
/** @ignore */
BindGroupSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "bindGroup"
};

exports.BindGroupSystem = BindGroupSystem;
//# sourceMappingURL=BindGroupSystem.js.map
