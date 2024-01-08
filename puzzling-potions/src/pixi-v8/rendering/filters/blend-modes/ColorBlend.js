'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BlendModeFilter = require('./BlendModeFilter.js');
var GLhls = require('./hls/GLhls.js');
var GPUhls = require('./hls/GPUhls.js');

class ColorBlend extends BlendModeFilter.BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                ${GLhls.hslgl}

                vec3 blendColor(vec3 base, vec3 blend,  float opacity)
                {
                    return (setLuminosity(blend, getLuminosity(base)) * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                fragColor = vec4(blendColor(back.rgb, front.rgb, front.a), uBlend);
                `
      },
      gpu: {
        functions: `
                ${GPUhls.hslgpu}

                fn blendColorOpacity(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    return (setLuminosity(blend, getLuminosity(base)) * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                out = vec4<f32>(blendColorOpacity(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
                `
      }
    });
  }
}

exports.ColorBlend = ColorBlend;
//# sourceMappingURL=ColorBlend.js.map
