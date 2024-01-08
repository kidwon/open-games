import { generateBatchGlProgram } from '../../batcher/gl/generateBatchGlProgram.mjs';
import fragmentSrc from './graphics-batcher-template.mjs';
import vertexSrc from './graphics-batcher-template2.mjs';

function generateDefaultGraphicsBatchGlProgram(maxTextures) {
  return generateBatchGlProgram({
    vertexSrc,
    fragmentSrc,
    maxTextures,
    name: "graphics"
  });
}

export { generateDefaultGraphicsBatchGlProgram };
//# sourceMappingURL=generateDefaultGraphicsBatchGlProgram.mjs.map
