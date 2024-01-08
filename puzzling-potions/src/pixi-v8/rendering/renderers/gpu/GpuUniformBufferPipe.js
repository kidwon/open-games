'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var Buffer = require('../shared/buffer/Buffer.js');
var _const = require('../shared/buffer/const.js');
var BindGroup = require('./shader/BindGroup.js');

class UniformBindGroup extends BindGroup.BindGroup {
  constructor() {
    super({
      0: new Buffer.Buffer({
        data: new Float32Array(128),
        usage: _const.BufferUsage.UNIFORM | _const.BufferUsage.COPY_DST
      })
    });
  }
  get buffer() {
    return this.resources[0];
  }
  get data() {
    return this.resources[0].data;
  }
}
class GpuUniformBufferPipe {
  constructor(renderer) {
    this.activeBindGroups = [];
    this.activeBindGroupIndex = 0;
    this.renderer = renderer;
  }
  getUniformBindGroup(uniformGroup) {
    const renderer = this.renderer;
    renderer.uniformBuffer.ensureUniformGroup(uniformGroup);
    const bindGroup = PoolGroup.BigPool.get(UniformBindGroup);
    renderer.uniformBuffer.syncUniformGroup(uniformGroup, bindGroup.data, 0);
    bindGroup.buffer.update(uniformGroup.buffer.data.byteLength);
    this.activeBindGroups[this.activeBindGroupIndex++] = bindGroup;
    return bindGroup;
  }
  renderEnd() {
    for (let i = 0; i < this.activeBindGroupIndex; i++) {
      PoolGroup.BigPool.return(this.activeBindGroups[i]);
    }
    this.activeBindGroupIndex = 0;
  }
}
/** @ignore */
GpuUniformBufferPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGPUPipes
  ],
  name: "uniformBuffer"
};

exports.GpuUniformBufferPipe = GpuUniformBufferPipe;
//# sourceMappingURL=GpuUniformBufferPipe.js.map
