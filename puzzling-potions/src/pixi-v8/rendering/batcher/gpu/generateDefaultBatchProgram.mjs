import programSrc from './batcher-template.mjs';
import { generateBatchProgram } from './generateBatchProgram.mjs';

function generateDefaultBatchProgram(maxTextures) {
  return generateBatchProgram({
    vertex: {
      source: programSrc,
      entryPoint: "mainVertex"
    },
    fragment: {
      source: programSrc,
      entryPoint: "mainFragment"
    },
    maxTextures
  });
}

export { generateDefaultBatchProgram };
//# sourceMappingURL=generateDefaultBatchProgram.mjs.map
