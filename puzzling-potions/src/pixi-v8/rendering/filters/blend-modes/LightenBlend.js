'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BlendModeFilter = require('./BlendModeFilter.js');

class LightenBlend extends BlendModeFilter.BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                vec3 blendLighten(vec3 base, vec3 blend, float opacity)
                {
                    return (max(base, blend) * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                fragColor = vec4(blendLighten(back.rgb, front.rgb, front.a), uBlend);
                `
      },
      gpu: {
        functions: `
                fn blendLighten(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    return (max(base, blend) * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                out = vec4<f32>(blendLighten(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
            `
      }
    });
  }
}

exports.LightenBlend = LightenBlend;
//# sourceMappingURL=LightenBlend.js.map
