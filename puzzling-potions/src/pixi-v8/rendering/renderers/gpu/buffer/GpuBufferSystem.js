'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var fastCopy = require('../../shared/buffer/utils/fastCopy.js');

class BufferSystem {
  constructor() {
    this._gpuBuffers = {};
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  getGPUBuffer(buffer) {
    return this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
  }
  updateBuffer(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
    if (buffer._updateID && buffer.data) {
      buffer._updateID = 0;
      this.gpu.device.queue.writeBuffer(gpuBuffer, 0, buffer.data.buffer, 0, buffer._updateSize);
    }
    return gpuBuffer;
  }
  /** dispose all WebGL resources of all managed buffers */
  destroyAll() {
    for (const id in this._gpuBuffers) {
      this._gpuBuffers[id].destroy();
    }
    this._gpuBuffers = {};
  }
  createGPUBuffer(buffer) {
    const gpuBuffer = this.gpu.device.createBuffer(buffer.descriptor);
    buffer._updateID = 0;
    if (buffer.data) {
      fastCopy.fastCopy(buffer.data.buffer, gpuBuffer.getMappedRange());
      gpuBuffer.unmap();
    }
    this._gpuBuffers[buffer.uid] = gpuBuffer;
    buffer.on("update", this.updateBuffer, this);
    buffer.on("change", this.onBufferChange, this);
    buffer.on("destroy", this.onBufferDestroy, this);
    return gpuBuffer;
  }
  onBufferChange(buffer) {
    let gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    gpuBuffer = this.createGPUBuffer(buffer);
    buffer._updateID = 0;
  }
  /**
   * Disposes buffer
   * @param buffer - buffer with data
   */
  onBufferDestroy(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    this._gpuBuffers[buffer.uid] = null;
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
BufferSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "buffer"
};

exports.BufferSystem = BufferSystem;
//# sourceMappingURL=GpuBufferSystem.js.map
