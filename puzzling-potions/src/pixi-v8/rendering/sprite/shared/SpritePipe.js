'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var BatchableSprite = require('./BatchableSprite.js');

let gpuSpriteHash;
class SpritePipe {
  constructor(renderer) {
    this.gpuSpriteHash = {};
    this.renderer = renderer;
    gpuSpriteHash = this.gpuSpriteHash;
  }
  addRenderable(renderable, instructionSet) {
    const gpuSprite = this.getGpuSprite(renderable);
    if (renderable.view.didUpdate)
      this.updateBatchableSprite(renderable, gpuSprite);
    this.renderer.renderPipes.batch.addToBatch(gpuSprite, instructionSet);
  }
  updateRenderable(renderable) {
    const gpuSprite = gpuSpriteHash[renderable.uid];
    if (renderable.view.didUpdate)
      this.updateBatchableSprite(renderable, gpuSprite);
    gpuSprite.batcher.updateElement(gpuSprite);
  }
  validateRenderable(renderable) {
    const texture = renderable.view._texture;
    const gpuSprite = this.getGpuSprite(renderable);
    if (gpuSprite.texture._source !== texture._source) {
      return !gpuSprite.batcher.checkAndUpdateTexture(gpuSprite, texture);
    }
    return false;
  }
  destroyRenderable(renderable) {
    const batchableSprite = gpuSpriteHash[renderable.uid];
    PoolGroup.BigPool.return(batchableSprite);
    gpuSpriteHash[renderable.uid] = null;
  }
  updateBatchableSprite(renderable, batchableSprite) {
    const view = renderable.view;
    view.didUpdate = false;
    batchableSprite.bounds = view.bounds;
    batchableSprite.texture = view._texture;
  }
  getGpuSprite(renderable) {
    return gpuSpriteHash[renderable.uid] || this.initGPUSprite(renderable);
  }
  initGPUSprite(renderable) {
    const batchableSprite = PoolGroup.BigPool.get(BatchableSprite.BatchableSprite);
    batchableSprite.sprite = renderable;
    batchableSprite.texture = renderable.view._texture;
    batchableSprite.bounds = renderable.view.bounds;
    gpuSpriteHash[renderable.uid] = batchableSprite;
    renderable.view.didUpdate = false;
    renderable.on("destroyed", () => {
      this.destroyRenderable(renderable);
    });
    return batchableSprite;
  }
  destroy() {
    for (const i in this.gpuSpriteHash) {
      PoolGroup.BigPool.return(this.gpuSpriteHash[i]);
    }
    this.gpuSpriteHash = null;
    this.renderer = null;
  }
}
/** @ignore */
SpritePipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "sprite"
};

exports.SpritePipe = SpritePipe;
//# sourceMappingURL=SpritePipe.js.map
