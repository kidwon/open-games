import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { BigPool } from '../../../utils/pool/PoolGroup.mjs';
import { Buffer } from '../shared/buffer/Buffer.mjs';
import { BufferUsage } from '../shared/buffer/const.mjs';
import { BindGroup } from './shader/BindGroup.mjs';

class UniformBindGroup extends BindGroup {
  constructor() {
    super({
      0: new Buffer({
        data: new Float32Array(128),
        usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST
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
    const bindGroup = BigPool.get(UniformBindGroup);
    renderer.uniformBuffer.syncUniformGroup(uniformGroup, bindGroup.data, 0);
    bindGroup.buffer.update(uniformGroup.buffer.data.byteLength);
    this.activeBindGroups[this.activeBindGroupIndex++] = bindGroup;
    return bindGroup;
  }
  renderEnd() {
    for (let i = 0; i < this.activeBindGroupIndex; i++) {
      BigPool.return(this.activeBindGroups[i]);
    }
    this.activeBindGroupIndex = 0;
  }
}
/** @ignore */
GpuUniformBufferPipe.extension = {
  type: [
    ExtensionType.WebGPUPipes
  ],
  name: "uniformBuffer"
};

export { GpuUniformBufferPipe };
//# sourceMappingURL=GpuUniformBufferPipe.mjs.map
