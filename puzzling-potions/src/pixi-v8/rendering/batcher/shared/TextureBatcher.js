'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _const = require('./const.js');
var optimizeBindings = require('./optimizeBindings.js');

const batchPool = [];
let batchPoolIndex = 0;
class TextureBatchOutput {
  constructor() {
    this.textures = [];
    this.size = 0;
    this.batchLocations = {};
  }
}
class TextureBatcher {
  constructor() {
    this.textureTicks = {};
    this.tick = 1e3;
  }
  begin() {
    batchPoolIndex = 0;
    this.bindingOffset = 0;
    this.reset();
  }
  reset() {
    this.tick++;
    this.output = batchPool[batchPoolIndex++] || new TextureBatchOutput();
    this.output.size = 0;
  }
  finish(previousBatch) {
    let output = this.output;
    if (previousBatch && previousBatch.textures.length && output.textures.length) {
      output = optimizeBindings.optimizeBindings(previousBatch, output, this.tick, this.bindingOffset++);
    }
    this.reset();
    return output;
  }
  add(texture) {
    const tick = this.tick;
    const textureTicks = this.textureTicks;
    if (textureTicks[texture.styleSourceKey] === tick)
      return true;
    const styleSourceKey = texture.styleSourceKey;
    const output = this.output;
    if (output.size === _const.MAX_TEXTURES)
      return false;
    output.textures[output.size] = texture;
    textureTicks[styleSourceKey] = tick;
    output.batchLocations[styleSourceKey] = output.size++;
    batchPoolIndex = 0;
    return true;
  }
  destroy() {
    this.output = null;
    this.textureTicks = null;
  }
}

exports.TextureBatchOutput = TextureBatchOutput;
exports.TextureBatcher = TextureBatcher;
//# sourceMappingURL=TextureBatcher.js.map
