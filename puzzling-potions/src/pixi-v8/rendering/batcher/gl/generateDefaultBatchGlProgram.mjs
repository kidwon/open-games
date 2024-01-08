import fragmentSrc from './batcher-template2.mjs';
import vertexSrc from './batcher-template.mjs';
import { generateBatchGlProgram } from './generateBatchGlProgram.mjs';

function generateDefaultBatchGlProgram(maxTextures) {
  return generateBatchGlProgram({
    vertexSrc,
    fragmentSrc,
    maxTextures,
    name: "default"
  });
}

export { generateDefaultBatchGlProgram };
//# sourceMappingURL=generateDefaultBatchGlProgram.mjs.map
