import { BlendModeFilter } from './BlendModeFilter.mjs';
import { hslgl } from './hls/GLhls.mjs';
import { hslgpu } from './hls/GPUhls.mjs';

class ColorBlend extends BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                ${hslgl}

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
                ${hslgpu}

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

export { ColorBlend };
//# sourceMappingURL=ColorBlend.mjs.map
