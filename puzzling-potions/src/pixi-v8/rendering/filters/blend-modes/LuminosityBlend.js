'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BlendModeFilter = require('./BlendModeFilter.js');
var GLhls = require('./hls/GLhls.js');
var GPUhls = require('./hls/GPUhls.js');

class LuminosityBlend extends BlendModeFilter.BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                ${GLhls.hslgl}

                vec3 blendLuminosity(vec3 base, vec3 blend,  float opacity)
                {
                    vec3 blendLuminosity = setLuminosity(base, getLuminosity(blend));
                    return (blendLuminosity * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                fragColor = vec4(blendLuminosity(back.rgb, front.rgb, front.a), uBlend);
                `
      },
      gpu: {
        functions: `
                ${GPUhls.hslgpu}

                fn blendLuminosity(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    let blendLuminosity: vec3<f32> = setLuminosity(base, getLuminosity(blend));
                    return (blendLuminosity * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                out = vec4<f32>(blendLuminosity(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
            `
      }
    });
  }
}

exports.LuminosityBlend = LuminosityBlend;
//# sourceMappingURL=LuminosityBlend.js.map
