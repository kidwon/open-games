'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BlendModeFilter = require('./BlendModeFilter.js');
var GLhls = require('./hls/GLhls.js');
var GPUhls = require('./hls/GPUhls.js');

class SaturationBlend extends BlendModeFilter.BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                ${GLhls.hslgl}

                vec3 blendSaturation(vec3 base, vec3 blend,  float opacity)
                {
                    vec3 blendSaturation = setLuminosity(setSaturation(base, getSaturation(blend)), getLuminosity(base));
                    return (blendSaturation * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                fragColor = vec4(blendSaturation(back.rgb, front.rgb, front.a), uBlend);
            `
      },
      gpu: {
        functions: `
                ${GPUhls.hslgpu}

                fn blendSaturation(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    let blendSaturation = setLuminosity(setSaturation(base, getSaturation(blend)), getLuminosity(base));
                    return (blendSaturation * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                out = vec4<f32>(blendSaturation(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
            `
      }
    });
  }
}

exports.SaturationBlend = SaturationBlend;
//# sourceMappingURL=SaturationBlend.js.map
