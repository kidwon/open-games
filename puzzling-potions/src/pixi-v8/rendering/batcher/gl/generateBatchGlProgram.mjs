import { GlProgram } from '../../renderers/gl/shader/GlProgram.mjs';

function generateBatchGlProgram({ vertexSrc, fragmentSrc, maxTextures, name }) {
  if (fragmentSrc.indexOf("%count%") < 0) {
    throw new Error('Fragment template must contain "%count%".');
  }
  if (fragmentSrc.indexOf("%forloop%") < 0) {
    throw new Error('Fragment template must contain "%forloop%".');
  }
  const samplerSrc = generateSampleSrc(maxTextures);
  fragmentSrc = fragmentSrc.replace(/%count%/gi, `${maxTextures}`);
  fragmentSrc = fragmentSrc.replace(/%forloop%/gi, samplerSrc);
  name = name ? `${name}-` : "";
  const program = new GlProgram({ vertex: vertexSrc, fragment: fragmentSrc, name: `${name}batch` });
  return program;
}
function generateSampleSrc(maxTextures) {
  const src = [];
  for (let i = 0; i < maxTextures; i++) {
    if (i > 0) {
      src.push("else");
    }
    if (i < maxTextures - 1) {
      src.push(`if(vTextureId < ${i}.5)`);
    }
    src.push("{");
    src.push(`	outColor = texture(uSamplers[${i}], vTextureCoord);`);
    src.push("}");
  }
  return src.join("\n");
}

export { generateBatchGlProgram };
//# sourceMappingURL=generateBatchGlProgram.mjs.map
