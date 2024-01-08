'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var State = require('../../renderers/shared/state/State.js');
var BatchableGraphics = require('./BatchableGraphics.js');

class GraphicsPipe {
  constructor(renderer, adaptor) {
    this.state = State.State.for2d();
    // batchable graphics list, used to render batches
    this.renderableBatchesHash = {};
    this.renderer = renderer;
    this.adaptor = adaptor;
    this.adaptor.init();
  }
  validateRenderable(renderable) {
    const context = renderable.view.context;
    const wasBatched = !!this.renderableBatchesHash[renderable.uid];
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(context);
    if (gpuContext.isBatchable || wasBatched !== gpuContext.isBatchable) {
      return true;
    }
    return false;
  }
  addRenderable(renderable, instructionSet) {
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(renderable.view.context);
    if (renderable.view.didUpdate) {
      renderable.view.didUpdate = false;
      this.rebuild(renderable);
    }
    if (gpuContext.isBatchable) {
      this.addToBatcher(renderable, instructionSet);
    } else {
      this.renderer.renderPipes.batch.break(instructionSet);
      instructionSet.add({
        type: "graphics",
        renderable
      });
    }
  }
  updateRenderable(renderable) {
    const batches = this.renderableBatchesHash[renderable.uid];
    if (batches) {
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        batch.batcher.updateElement(batch);
      }
    }
  }
  execute({ renderable }) {
    if (!renderable.isRenderable)
      return;
    this.adaptor.execute(this, renderable);
  }
  rebuild(renderable) {
    const wasBatched = !!this.renderableBatchesHash[renderable.uid];
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(renderable.view.context);
    if (wasBatched) {
      this.removeBatchForRenderable(renderable.uid);
    }
    if (gpuContext.isBatchable) {
      this.initBatchesForRenderable(renderable);
    }
    renderable.view.batched = gpuContext.isBatchable;
  }
  // Batchable graphics functions
  addToBatcher(renderable, instructionSet) {
    const batchPipe = this.renderer.renderPipes.batch;
    const batches = this.getBatchesForRenderable(renderable);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      batchPipe.addToBatch(batch, instructionSet);
    }
  }
  getBatchesForRenderable(renderable) {
    return this.renderableBatchesHash[renderable.uid] || this.initBatchesForRenderable(renderable);
  }
  initBatchesForRenderable(renderable) {
    const context = renderable.view.context;
    const gpuContext = this.renderer.graphicsContext.getGpuContext(context);
    const batches = gpuContext.batches.map((batch) => {
      const batchClone = PoolGroup.BigPool.get(BatchableGraphics.BatchableGraphics);
      batch.copyTo(batchClone);
      batchClone.renderable = renderable;
      return batchClone;
    });
    this.renderableBatchesHash[renderable.uid] = batches;
    renderable.on("destroyed", () => {
      this.destroyRenderable(renderable);
    });
    return batches;
  }
  destroyRenderable(renderable) {
    this.removeBatchForRenderable(renderable.uid);
  }
  removeBatchForRenderable(renderableUid) {
    this.renderableBatchesHash[renderableUid].forEach((batch) => {
      PoolGroup.BigPool.return(batch);
    });
    this.renderableBatchesHash[renderableUid] = null;
  }
  destroy() {
    this.renderer = null;
    this.shader.destroy();
    this.shader = null;
    this.adaptor.destroy();
    this.adaptor = null;
    this.state = null;
    for (const i in this.renderableBatchesHash) {
      this.removeBatchForRenderable(i);
    }
    this.renderableBatchesHash = null;
  }
}
/** @ignore */
GraphicsPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "graphics"
};

exports.GraphicsPipe = GraphicsPipe;
//# sourceMappingURL=GraphicsPipe.js.map
