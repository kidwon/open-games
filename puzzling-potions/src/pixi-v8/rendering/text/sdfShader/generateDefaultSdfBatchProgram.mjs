import { generateBatchProgram } from '../../batcher/gpu/generateBatchProgram.mjs';
import programSrc from './sdf-batcher-template.mjs';

function generateDefaultSdfBatchProgram(maxTextures) {
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

export { generateDefaultSdfBatchProgram };
//# sourceMappingURL=generateDefaultSdfBatchProgram.mjs.map
