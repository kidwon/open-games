'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BlendModeFilter = require('./BlendModeFilter.js');

class SubtractBlend extends BlendModeFilter.BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                float subtract(float base, float blend)
                {
                    return max(0.0, base - blend);
                }

                vec3 blendSubtract(vec3 base, vec3 blend, float opacity)
                {
                    vec3 blended = vec3(
                        subtract(base.r, blend.r),
                        subtract(base.g, blend.g),
                        subtract(base.b, blend.b)
                    );

                    return (blended * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                fragColor = vec4(blendSubtract(back.rgb, front.rgb, front.a), uBlend);
                `
      },
      gpu: {
        functions: `
                fn subtract(base: f32, blend: f32) -> f32
                {
                    return max(0, base - blend);
                }

                fn blendSubtract(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    let blended = vec3<f32>(
                        subtract(base.r, blend.r),
                        subtract(base.g, blend.g),
                        subtract(base.b, blend.b)
                    );

                    return (blended * opacity + base * (1.0 - opacity));
                }
                `,
        main: `
                out = vec4<f32>(blendSubtract(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
                `
      }
    });
  }
}

exports.SubtractBlend = SubtractBlend;
//# sourceMappingURL=SubtractBlend.js.map
