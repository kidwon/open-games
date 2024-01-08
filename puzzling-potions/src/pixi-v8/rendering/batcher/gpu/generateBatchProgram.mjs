import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';

function generateBatchProgram({ vertex, fragment, maxTextures }) {
  if (fragment.source.indexOf("%bindings%") < 0) {
    throw new Error('Fragment template must contain "%bindings%".');
  }
  if (fragment.source.indexOf("%forloop%") < 0) {
    throw new Error('Fragment template must contain "%forloop%".');
  }
  const bindingSrc = generateBindingSrc(maxTextures);
  const samplerSrc = generateSampleSrc(maxTextures);
  let fragmentSrc = fragment.source;
  fragmentSrc = fragmentSrc.replace(/%bindings%/gi, bindingSrc);
  fragmentSrc = fragmentSrc.replace(/%forloop%/gi, samplerSrc);
  let vertexSrc = vertex.source;
  if (vertexSrc === fragment.source) {
    vertexSrc = fragmentSrc;
  }
  const program = new GpuProgram({
    vertex: {
      source: vertexSrc,
      entryPoint: vertex.entryPoint
    },
    fragment: {
      source: fragmentSrc,
      entryPoint: fragment.entryPoint
    }
  });
  return program;
}
function generateLayout(maxTextures) {
  const layout = {};
  let bindIndex = 0;
  for (let i = 0; i < maxTextures; i++) {
    layout[`textureSource${i + 1}`] = bindIndex++;
    layout[`textureSampler${i + 1}`] = bindIndex++;
  }
  return layout;
}
function generateGPULayout(maxTextures) {
  const gpuLayout = [];
  let bindIndex = 0;
  for (let i = 0; i < maxTextures; i++) {
    gpuLayout[bindIndex] = {
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: false
      },
      binding: bindIndex,
      visibility: GPUShaderStage.FRAGMENT
    };
    bindIndex++;
    gpuLayout[bindIndex] = {
      sampler: {
        type: "filtering"
      },
      binding: bindIndex,
      visibility: GPUShaderStage.FRAGMENT
    };
    bindIndex++;
  }
  return gpuLayout;
}
function generateSampleSrc(maxTextures) {
  const src = [];
  if (maxTextures === 1) {
    src.push("outColor = textureSampleGrad(textureSource1, textureSampler1, uv, uvDx, uvDy);");
  } else {
    src.push("switch textureId {");
    for (let i = 0; i < maxTextures; i++) {
      if (i === maxTextures - 1) {
        src.push(`  default:{`);
      } else {
        src.push(`  case ${i}:{`);
      }
      src.push(`      outColor = textureSampleGrad(textureSource${i + 1}, textureSampler${i + 1}, uv, uvDx, uvDy);`);
      src.push(`      break;}`);
    }
    src.push(`}`);
  }
  return src.join("\n");
}
function generateBindingSrc(maxTextures) {
  const src = [];
  if (maxTextures === 1) {
    src.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;");
    src.push("@group(1) @binding(1) var textureSampler1: sampler;");
  } else {
    let bindingIndex = 0;
    for (let i = 0; i < maxTextures; i++) {
      src.push(`@group(1) @binding(${bindingIndex++}) var textureSource${i + 1}: texture_2d<f32>;`);
      src.push(`@group(1) @binding(${bindingIndex++}) var textureSampler${i + 1}: sampler;`);
    }
  }
  return src.join("\n");
}

export { generateBatchProgram, generateBindingSrc, generateGPULayout, generateLayout, generateSampleSrc };
//# sourceMappingURL=generateBatchProgram.mjs.map
