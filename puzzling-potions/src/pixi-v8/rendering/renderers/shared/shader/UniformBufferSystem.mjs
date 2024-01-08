import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Buffer } from '../buffer/Buffer.mjs';
import { BufferUsage } from '../buffer/const.mjs';
import { createUBOElements } from './utils/createUBOElements.mjs';
import { generateUniformBufferSync } from './utils/createUniformBufferSync.mjs';

class UniformBufferSystem {
  constructor(renderer) {
    /** Cache of uniform buffer layouts and sync functions, so we don't have to re-create them */
    this._syncFunctionHash = {};
    this.renderer = renderer;
  }
  ensureUniformGroup(uniformGroup) {
    if (!uniformGroup._syncFunction) {
      this.initUniformGroup(uniformGroup);
    }
  }
  initUniformGroup(uniformGroup) {
    const uniformGroupSignature = uniformGroup.signature;
    let uniformData = this._syncFunctionHash[uniformGroupSignature];
    if (!uniformData) {
      const elements = Object.keys(uniformGroup.uniformStructures).map((i) => uniformGroup.uniformStructures[i]);
      const layout = createUBOElements(elements);
      const syncFunction = generateUniformBufferSync(layout.uboElements);
      uniformData = this._syncFunctionHash[uniformGroupSignature] = {
        layout,
        syncFunction
      };
    }
    uniformGroup._syncFunction = uniformData.syncFunction;
    uniformGroup.buffer = new Buffer({
      data: new Float32Array(uniformData.layout.size / 4),
      usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST
    });
    return uniformGroup._syncFunction;
  }
  syncUniformGroup(uniformGroup, data, offset) {
    const syncFunction = uniformGroup._syncFunction || this.initUniformGroup(uniformGroup);
    data || (data = uniformGroup.buffer.data);
    offset || (offset = 0);
    syncFunction(uniformGroup.uniforms, data, offset);
    return true;
  }
  updateUniformGroup(uniformGroup) {
    if (uniformGroup.isStatic && !uniformGroup.dirtyId)
      return false;
    uniformGroup.dirtyId = 0;
    const synced = this.syncUniformGroup(uniformGroup);
    uniformGroup.buffer.update();
    return synced;
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
UniformBufferSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "uniformBuffer"
};

export { UniformBufferSystem };
//# sourceMappingURL=UniformBufferSystem.mjs.map
