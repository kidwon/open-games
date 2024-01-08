import { MAX_TEXTURES } from './const.mjs';
import { optimizeBindings } from './optimizeBindings.mjs';

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
      output = optimizeBindings(previousBatch, output, this.tick, this.bindingOffset++);
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
    if (output.size === MAX_TEXTURES)
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

export { TextureBatchOutput, TextureBatcher };
//# sourceMappingURL=TextureBatcher.mjs.map
