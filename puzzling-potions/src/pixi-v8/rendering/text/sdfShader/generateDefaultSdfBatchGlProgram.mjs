import { generateBatchGlProgram } from '../../batcher/gl/generateBatchGlProgram.mjs';
import fragmentSrc from './sdf-batcher-template3.mjs';
import vertexSrc from './sdf-batcher-template2.mjs';

function generateDefaultSdfBatchGlProgram(maxTextures) {
  return generateBatchGlProgram({
    vertexSrc,
    fragmentSrc,
    maxTextures,
    name: "sdf"
  });
}

export { generateDefaultSdfBatchGlProgram };
//# sourceMappingURL=generateDefaultSdfBatchGlProgram.mjs.map
