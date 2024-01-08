'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');

class GpuEncoderSystem {
  constructor(renderer) {
    this.boundBindGroup = {};
    this.boundVertexBuffer = {};
    this.renderer = renderer;
  }
  start() {
    this.commandFinished = new Promise((resolve) => {
      this.resolveCommandFinished = resolve;
    });
    this.commandEncoder = this.renderer.gpu.device.createCommandEncoder();
  }
  beginRenderPass(renderTarget, gpuRenderTarget) {
    if (this.renderPassEncoder) {
      this.renderPassEncoder.end();
    }
    this.clearCache();
    this.renderPassEncoder = this.commandEncoder.beginRenderPass(gpuRenderTarget.descriptor);
    this.setViewport(renderTarget.viewport);
  }
  setViewport(viewport) {
    this.renderPassEncoder.setViewport(
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height,
      0,
      1
    );
  }
  setScissor(bounds) {
    bounds.fit(this.renderer.renderTarget.renderTarget.viewport);
    this.renderPassEncoder.setScissorRect(
      bounds.minX,
      bounds.minY,
      bounds.width,
      bounds.height
    );
  }
  clearScissor() {
    const viewport = this.renderer.renderTarget.renderTarget.viewport;
    this.renderPassEncoder.setScissorRect(
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height
    );
  }
  setPipelineFromGeometryProgramAndState(geometry, program, state, topology) {
    const pipeline = this.renderer.pipeline.getPipeline(geometry, program, state, topology);
    this.setPipeline(pipeline);
  }
  setPipeline(pipeline) {
    if (this.boundPipeline === pipeline)
      return;
    this.boundPipeline = pipeline;
    this.renderPassEncoder.setPipeline(pipeline);
  }
  setVertexBuffer(index, buffer) {
    if (this.boundVertexBuffer[index] === buffer)
      return;
    this.boundVertexBuffer[index] = buffer;
    this.renderPassEncoder.setVertexBuffer(
      index,
      this.renderer.buffer.updateBuffer(buffer)
    );
  }
  setIndexBuffer(buffer) {
    if (this.boundIndexBuffer === buffer)
      return;
    this.boundIndexBuffer = buffer;
    this.renderPassEncoder.setIndexBuffer(
      this.renderer.buffer.updateBuffer(buffer),
      "uint32"
    );
  }
  setBindGroup(index, bindGroup, program) {
    if (this.boundBindGroup[index] === bindGroup)
      return;
    this.boundBindGroup[index] = bindGroup;
    const gpuBindGroup = this.renderer.bindGroup.getBindGroup(bindGroup, program, index);
    this.renderPassEncoder.setBindGroup(index, gpuBindGroup);
  }
  setGeometry(geometry) {
    for (const i in geometry.attributes) {
      const attribute = geometry.attributes[i];
      this.setVertexBuffer(attribute.shaderLocation, attribute.buffer);
    }
    if (geometry.indexBuffer) {
      this.setIndexBuffer(geometry.indexBuffer);
    }
  }
  setShaderBindGroups(shader, skipSync) {
    for (const i in shader.groups) {
      const bindGroup = shader.groups[i];
      if (!skipSync) {
        this.syncBindGroup(bindGroup);
      }
      this.setBindGroup(i, bindGroup, shader.gpuProgram);
    }
  }
  syncBindGroup(bindGroup) {
    for (const j in bindGroup.resources) {
      const resource = bindGroup.resources[j];
      if (resource.isUniformGroup) {
        this.renderer.uniformBuffer.updateUniformGroup(resource);
      }
    }
  }
  draw(options) {
    const { geometry, shader, state, topology, size, start, instanceCount, skipSync } = options;
    this.setPipelineFromGeometryProgramAndState(geometry, shader.gpuProgram, state, topology);
    this.setGeometry(geometry);
    this.setShaderBindGroups(shader, skipSync);
    if (geometry.indexBuffer) {
      this.renderPassEncoder.drawIndexed(size || geometry.indexBuffer.data.length, instanceCount || 1, start || 0);
    } else {
      this.renderPassEncoder.draw(size || geometry.getSize(), instanceCount || 1, start || 0);
    }
  }
  finishRenderPass() {
    if (this.renderPassEncoder) {
      this.renderPassEncoder.end();
      this.renderPassEncoder = null;
    }
  }
  postrender() {
    this.finishRenderPass();
    this.gpu.device.queue.submit([this.commandEncoder.finish()]);
    this.resolveCommandFinished();
  }
  // restores a render pass if finishRenderPass was called
  // not optimised as really used for debugging!
  // used when we want to stop drawing and log a texture..
  restoreRenderPass() {
    const descriptor = this.renderer.renderTarget.getDescriptor(
      this.renderer.renderTarget.renderTarget,
      false,
      [0, 0, 0, 1]
    );
    this.renderPassEncoder = this.commandEncoder.beginRenderPass(descriptor);
    const boundPipeline = this.boundPipeline;
    const boundVertexBuffer = { ...this.boundVertexBuffer };
    const boundIndexBuffer = this.boundIndexBuffer;
    const boundBindGroup = { ...this.boundBindGroup };
    this.clearCache();
    const viewport = this.renderer.renderTarget.renderTarget.viewport;
    this.renderPassEncoder.setViewport(
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height,
      0,
      1
    );
    this.setPipeline(boundPipeline);
    for (const i in boundVertexBuffer) {
      this.setVertexBuffer(i, boundVertexBuffer[i]);
    }
    for (const i in boundBindGroup) {
      this.setBindGroup(i, boundBindGroup[i], null);
    }
    this.setIndexBuffer(boundIndexBuffer);
  }
  clearCache() {
    for (let i = 0; i < 16; i++) {
      this.boundBindGroup[i] = null;
      this.boundVertexBuffer[i] = null;
    }
    this.boundIndexBuffer = null;
    this.boundPipeline = null;
  }
  destroy() {
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
}
/** @ignore */
GpuEncoderSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "encoder"
};

exports.GpuEncoderSystem = GpuEncoderSystem;
//# sourceMappingURL=GpuEncoderSystem.js.map
