const missing = [];
let missingCount = 0;
const currentCopy = [];
let currentCount = 0;
const usedSlots = {};
function optimizeBindings(previousTextureBatch, currentTextureBatch, tick, bindingOffset) {
  missingCount = 0;
  currentCount = 0;
  const boundTextureSize = 16;
  const prev = previousTextureBatch.textures;
  const next = currentTextureBatch.textures;
  const curr = currentCopy;
  for (let i = 0; i < next.length; i++) {
    curr[i] = next[i];
    currentCount++;
  }
  for (let i = 0; i < prev.length; i++) {
    next[i] = prev[i];
  }
  const batchLocations = currentTextureBatch.batchLocations;
  for (let i = 0; i < currentCount; i++) {
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
      missing[missingCount++] = curr[i];
    }
  }
  for (let i = 0; i < missingCount; i++) {
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

export { currentCopy, currentCount, missing, missingCount, optimizeBindings, usedSlots };
//# sourceMappingURL=optimizeBindings.mjs.map
