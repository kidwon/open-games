'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const missing = [];
exports.missingCount = 0;
const currentCopy = [];
exports.currentCount = 0;
const usedSlots = {};
function optimizeBindings(previousTextureBatch, currentTextureBatch, tick, bindingOffset) {
  exports.missingCount = 0;
  exports.currentCount = 0;
  const boundTextureSize = 16;
  const prev = previousTextureBatch.textures;
  const next = currentTextureBatch.textures;
  const curr = currentCopy;
  for (let i = 0; i < next.length; i++) {
    curr[i] = next[i];
    exports.currentCount++;
  }
  for (let i = 0; i < prev.length; i++) {
    next[i] = prev[i];
  }
  const batchLocations = currentTextureBatch.batchLocations;
  for (let i = 0; i < exports.currentCount; i++) {
    const boundTexture = curr[i];
    let found = false;
    for (let j = 0; j < prev.length; j++) {
      if (boundTexture === prev[j]) {
        found = true;
        usedSlots[i] = tick;
        batchLocations[boundTexture.styleSourceKey] = j;
        break;
      }
    }
    if (!found) {
      missing[exports.missingCount++] = curr[i];
    }
  }
  for (let i = 0; i < exports.missingCount; i++) {
    const missingTexture = missing[i];
    for (let j = 0; j < boundTextureSize; j++) {
      const modJ = (j + bindingOffset) % 16;
      if (usedSlots[modJ] !== tick) {
        next[modJ] = missingTexture;
        usedSlots[modJ] = tick;
        batchLocations[missingTexture.styleSourceKey] = modJ;
        break;
      }
    }
  }
  return currentTextureBatch;
}

exports.currentCopy = currentCopy;
exports.missing = missing;
exports.optimizeBindings = optimizeBindings;
exports.usedSlots = usedSlots;
//# sourceMappingURL=optimizeBindings.js.map
