import { generateBatchProgram } from '../../batcher/gpu/generateBatchProgram.mjs';
import programSrc from './graphics-batcher-template.mjs';

function generateDefaultGraphicsBatchProgram(maxTextures) {
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

export { generateDefaultGraphicsBatchProgram };
//# sourceMappingURL=generateDefaultGraphicsBatchProgram.mjs.map
