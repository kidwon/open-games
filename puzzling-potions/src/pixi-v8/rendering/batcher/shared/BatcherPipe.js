'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var State = require('../../renderers/shared/state/State.js');
var getBatchedGeometry = require('../gpu/getBatchedGeometry.js');
var Batcher = require('./Batcher.js');

class BatcherPipe {
  constructor(renderer, adaptor) {
    this.toUpdate = [];
    // shader: GpuShader;
    this.state = State.State.for2d();
    this._batches = {};
    this.renderer = renderer;
    this.adaptor = adaptor;
    this.adaptor.init();
  }
  buildStart(instructionSet) {
    this.lastBatch = 0;
    if (!this._batches[instructionSet.uid]) {
      this._batches[instructionSet.uid] = {
        batcher: new Batcher.Batcher(),
        geometry: getBatchedGeometry.getBatchedGeometry()
      };
    }
    this._batches[instructionSet.uid].batcher.begin();
  }
  addToBatch(batchableObject, instructionSet) {
    this._batches[instructionSet.uid].batcher.add(batchableObject);
  }
  break(instructionSet) {
    const batcher = this._batches[instructionSet.uid].batcher;
    const hardBreak = instructionSet.instructionSize > 0 && instructionSet.lastInstruction().type !== "batch";
    batcher.break(hardBreak);
    while (this.lastBatch < batcher.batchIndex) {
      const batch = batcher.batches[this.lastBatch++];
      if (batch.elementSize !== 0) {
        batch.batchParent = this._batches[instructionSet.uid];
        instructionSet.instructions[instructionSet.instructionSize++] = batch;
      }
    }
  }
  buildEnd(instructionSet) {
    this.break(instructionSet);
    const { geometry, batcher } = this._batches[instructionSet.uid];
    if (batcher.elementSize === 0)
      return;
    batcher.finish();
    geometry.indexBuffer.data = batcher.indexBuffer;
    geometry.buffers[0].data = batcher.attributeBuffer.float32View;
    geometry.indexBuffer.update(batcher.indexSize * 4);
  }
  upload(instructionSet) {
    const activeBatcher = this._batches[instructionSet.uid];
    if (activeBatcher && activeBatcher.batcher.dirty) {
      activeBatcher.batcher.dirty = false;
      const attributeBuffer = activeBatcher.geometry.buffers[0];
      attributeBuffer.update(activeBatcher.batcher.attributeSize * 4);
      this.renderer.buffer.updateBuffer(attributeBuffer);
    }
  }
  execute(batch) {
    this.adaptor.execute(this, batch);
  }
  destroy() {
    this.toUpdate = null;
    this.instructionSet = null;
    this.activeBatcher = null;
    this.state = null;
    this._batches = null;
    this.renderer = null;
    this.adaptor.destroy();
    this.adaptor = null;
    for (const i in this._batches) {
      const batchData = this._batches[i];
      batchData.batcher.destroy();
      batchData.geometry.destroy();
    }
  }
}
/** @ignore */
BatcherPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "batch"
};

exports.BatcherPipe = BatcherPipe;
//# sourceMappingURL=BatcherPipe.js.map
