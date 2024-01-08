'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var Buffer = require('../buffer/Buffer.js');
var _const = require('../buffer/const.js');
var createUBOElements = require('./utils/createUBOElements.js');
var createUniformBufferSync = require('./utils/createUniformBufferSync.js');

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
      const layout = createUBOElements.createUBOElements(elements);
      const syncFunction = createUniformBufferSync.generateUniformBufferSync(layout.uboElements);
      uniformData = this._syncFunctionHash[uniformGroupSignature] = {
        layout,
        syncFunction
      };
    }
    uniformGroup._syncFunction = uniformData.syncFunction;
    uniformGroup.buffer = new Buffer.Buffer({
      data: new Float32Array(uniformData.layout.size / 4),
      usage: _const.BufferUsage.UNIFORM | _const.BufferUsage.COPY_DST
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
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "uniformBuffer"
};

exports.UniformBufferSystem = UniformBufferSystem;
//# sourceMappingURL=UniformBufferSystem.js.map
