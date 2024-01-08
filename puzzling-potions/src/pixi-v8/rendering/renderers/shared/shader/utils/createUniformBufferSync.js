'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createUBOElements = require('./createUBOElements.js');
var uniformBufferParsers = require('./uniformBufferParsers.js');

const UBO_TO_SINGLE_SETTERS = {
  "f32": `
        data[offset] = v;
    `,
  "vec2<f32>": `
        data[offset] = v[0];
        data[offset+1] = v[1];
    `,
  "vec3<f32>": `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

    `,
  "vec4<f32>": `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];
        data[offset+3] = v[3];
    `,
  "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset+1] = v[1];

        data[offset+4] = v[2];
        data[offset+5] = v[3];
    `,
  "mat3x3<f32>": `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];

        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `,
  "mat4x4<f32>": `
        for(var i = 0; i < 16; i++)
        {
            data[offset + i] = v[i];
        }
    `
};
function generateUniformBufferSync(uboElements) {
  const funcFragments = [`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
    `];
  let prev = 0;
  for (let i = 0; i < uboElements.length; i++) {
    const uboElement = uboElements[i];
    const name = uboElement.data.name;
    let parsed = false;
    let offset = 0;
    for (let j = 0; j < uniformBufferParsers.uniformBufferParsers.length; j++) {
      const uniformParser = uniformBufferParsers.uniformBufferParsers[j];
      if (uniformParser.test(uboElement.data)) {
        offset = uboElement.offset / 4;
        funcFragments.push(
          `offset += ${offset - prev};`,
          uniformBufferParsers.uniformBufferParsers[j].code(name)
        );
        parsed = true;
        break;
      }
    }
    if (!parsed) {
      if (uboElement.data.size > 1) {
        const rowSize = Math.max(createUBOElements.WGSL_TO_STD40_SIZE[uboElement.data.type] / 16, 1);
        const elementSize = uboElement.data.value.length / uboElement.data.size;
        const remainder = (4 - elementSize % 4) % 4;
        offset = uboElement.offset / 4;
        funcFragments.push(
          /* wgsl */
          `
                    v = uv.${name};
                    offset += ${offset - prev};

                    t = 0;

                    for(var i=0; i < ${uboElement.data.size * rowSize}; i++)
                    {
                        for(var j = 0; j < ${elementSize}; j++)
                        {
                            data[offset++] = v[t++];
                        }
                        offset += ${remainder};
                    }
                `
        );
      } else {
        const template = UBO_TO_SINGLE_SETTERS[uboElement.data.type];
        offset = uboElement.offset / 4;
        funcFragments.push(
          /* wgsl */
          `
                    v = uv.${name};
                    offset += ${offset - prev};
                    ${template};
                `
        );
      }
    }
    prev = offset;
  }
  const fragmentSrc = funcFragments.join("\n");
  return new Function(
    "uv",
    "data",
    "offset",
    fragmentSrc
  );
}

exports.generateUniformBufferSync = generateUniformBufferSync;
//# sourceMappingURL=createUniformBufferSync.js.map
