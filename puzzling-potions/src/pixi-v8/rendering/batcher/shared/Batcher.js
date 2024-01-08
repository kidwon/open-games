'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ViewableBuffer = require('../../../utils/ViewableBuffer.js');
var fastCopy = require('../../renderers/shared/buffer/utils/fastCopy.js');
var TextureBatcher = require('./TextureBatcher.js');

class Batch {
  constructor() {
    this.type = "batch";
    this.action = "renderer";
    this.elementStart = 0;
    this.elementSize = 0;
    // for drawing..
    this.start = 0;
    this.size = 0;
    this.canBundle = true;
  }
  destroy() {
    this.textures = null;
    this.batchParent = null;
  }
}
class Batcher {
  constructor(vertexSize = 4, indexSize = 6) {
    this.maxSize = 4096 * 20;
    this.dirty = true;
    this.batchIndex = 0;
    this.batches = [];
    // specifics.
    this.vertexSize = 6;
    this.textureBatcher = new TextureBatcher.TextureBatcher();
    this.elements = [];
    this.attributeBuffer = new ViewableBuffer.ViewableBuffer(vertexSize * this.vertexSize * 4);
    this.indexBuffer = new Uint32Array(indexSize);
  }
  begin() {
    this.batchIndex = 0;
    this.currentBlendMode = "inherit";
    let currentBatch = this.batches[this.batchIndex];
    if (!currentBatch) {
      currentBatch = this.batches[this.batchIndex] = new Batch();
    }
    currentBatch.elementSize = 0;
    currentBatch.start = 0;
    currentBatch.size = 0;
    this.attributeSize = 0;
    this.indexSize = 0;
    this.elementSize = 0;
    this.textureBatcher.begin();
    this.dirty = true;
  }
  add(batchableObject) {
    let batch = this.batches[this.batchIndex];
    const texture = batchableObject.texture;
    const blendMode = batchableObject.blendMode;
    if (this.currentBlendMode !== blendMode || batch.elementSize >= this.maxSize || !this.textureBatcher.add(texture)) {
      this.break(false);
      this.currentBlendMode = blendMode;
      batch = this.batches[this.batchIndex];
      batch.blendMode = blendMode;
      this.textureBatcher.add(texture);
    }
    batch.elementSize++;
    batchableObject.batcher = this;
    batchableObject.batch = batch;
    batchableObject.location = this.attributeSize;
    batchableObject.indexStart = this.indexSize;
    this.indexSize += batchableObject.indexSize;
    this.attributeSize += batchableObject.vertexSize * this.vertexSize;
    this.elements[this.elementSize++] = batchableObject;
  }
  checkAndUpdateTexture(batchableObject, texture) {
    const textureId = batchableObject.batch.textures.batchLocations[texture.styleSourceKey];
    if (textureId === void 0)
      return false;
    batchableObject.textureId = textureId;
    batchableObject.texture = texture;
    return true;
  }
  updateElement(batchableObject) {
    this.dirty = true;
    batchableObject.packAttributes(
      this.attributeBuffer.float32View,
      this.attributeBuffer.uint32View,
      batchableObject.location,
      batchableObject.textureId
    );
  }
  hideElement(element) {
    this.dirty = true;
    const buffer = this.attributeBuffer.float32View;
    let location = element.location;
    for (let i = 0; i < element.vertexSize; i++) {
      buffer[location] = 0;
      buffer[location + 1] = 0;
      location += 6;
    }
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param hardBreak - this breaks all the batch data and stops it from trying to optimise the textures
   */
  break(hardBreak) {
    if (this.elementSize === 0)
      return;
    let previousBatch;
    if (this.batchIndex > 0) {
      previousBatch = this.batches[this.batchIndex - 1];
    }
    if (this.attributeSize * 4 > this.attributeBuffer.size) {
      this._resizeAttributeBuffer(this.attributeSize * 4);
    }
    if (this.indexSize > this.indexBuffer.length) {
      this._resizeIndexBuffer(this.indexSize);
    }
    const currentBatch = this.batches[this.batchIndex];
    currentBatch.size = this.indexSize - currentBatch.start;
    if (!hardBreak && previousBatch) {
      currentBatch.textures = this.textureBatcher.finish(previousBatch.textures);
    } else {
      currentBatch.textures = this.textureBatcher.finish();
    }
    const size = this.elementSize - currentBatch.elementStart;
    for (let i = 0; i < size; i++) {
      const batchableObject = this.elements[currentBatch.elementStart + i];
      batchableObject.textureId = currentBatch.textures.batchLocations[batchableObject.texture.styleSourceKey];
      batchableObject.packAttributes(
        this.attributeBuffer.float32View,
        this.attributeBuffer.uint32View,
        batchableObject.location,
        batchableObject.textureId
      );
      batchableObject.packIndex(
        this.indexBuffer,
        batchableObject.indexStart,
        batchableObject.location / this.vertexSize
      );
    }
    this.batchIndex++;
    let nextBatch = this.batches[this.batchIndex];
    if (!nextBatch) {
      nextBatch = this.batches[this.batchIndex] = new Batch();
    }
    nextBatch.blendMode = this.currentBlendMode;
    nextBatch.elementStart = this.elementSize;
    nextBatch.elementSize = 0;
    nextBatch.start = this.indexSize;
  }
  finish() {
    this.break(false);
    if (this.elementSize === 0)
      return;
    const currentBatch = this.batches[this.batchIndex];
    currentBatch.size = this.indexSize - currentBatch.start;
    if (this.batchIndex > 0) {
      const previousBatch = this.batches[this.batchIndex - 1];
      currentBatch.textures = this.textureBatcher.finish(previousBatch.textures);
      return;
    }
    currentBatch.textures = this.textureBatcher.finish();
  }
  update() {
  }
  ensureAttributeBuffer(size) {
    if (size * 4 < this.attributeBuffer.size)
      return;
    this._resizeAttributeBuffer(size * 4);
  }
  ensureIndexBuffer(size) {
    if (size < this.indexBuffer.length)
      return;
    this._resizeIndexBuffer(size);
  }
  _resizeAttributeBuffer(size) {
    const newSize = Math.max(size, this.attributeBuffer.size * 2);
    const newArrayBuffer = new ViewableBuffer.ViewableBuffer(newSize);
    fastCopy.fastCopy(this.attributeBuffer.rawBinaryData, newArrayBuffer.rawBinaryData);
    this.attributeBuffer = newArrayBuffer;
  }
  _resizeIndexBuffer(size) {
    const indexBuffer = this.indexBuffer;
    const newSize = Math.max(size, indexBuffer.length * 2);
    const newIndexBuffer = new Uint32Array(newSize);
    fastCopy.fastCopy(indexBuffer.buffer, newIndexBuffer.buffer);
    this.indexBuffer = newIndexBuffer;
  }
  destroy() {
    for (let i = 0; i < this.batches.length; i++) {
      this.batches[i].destroy();
    }
    this.batches = null;
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].batch = null;
    }
    this.elements = null;
    this.indexBuffer = null;
    this.attributeBuffer.destroy();
    this.attributeBuffer = null;
    this.textureBatcher.destroy();
    this.boundTextures = null;
  }
}

exports.Batch = Batch;
exports.Batcher = Batcher;
//# sourceMappingURL=Batcher.js.map
