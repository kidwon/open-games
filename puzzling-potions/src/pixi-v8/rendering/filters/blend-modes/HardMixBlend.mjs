import { BlendModeFilter } from './BlendModeFilter.mjs';

class HardMixBlend extends BlendModeFilter {
  constructor() {
    super({
      gl: {
        functions: `
                float hardMix(float base, float blend)
                {
                    return (base + blend >= 1.0) ? 1.0 : 0.0;
                }

                vec3 blendHardMix(vec3 base, vec3 blend,  float opacity)
                {
                    vec3 blended = vec3(
                        hardMix(base.r, blend.r),
                        hardMix(base.g, blend.g),
                        hardMix(base.b, blend.b)
                    );
                    return (blended * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                fragColor = vec4(blendHardMix(back.rgb, front.rgb, front.a), uBlend);
            `
      },
      gpu: {
        functions: `
                fn hardMix(base: f32, blend: f32) -> f32
                {
                    return select(0.0, 1.0, base + blend >= 1.0);
                }

                fn blendHardMix(base:vec3<f32>,  blend:vec3<f32>,  opacity:f32) -> vec3<f32>
                {
                    let blended: vec3<f32> = vec3<f32>(
                        hardMix(base.r, blend.r),
                        hardMix(base.g, blend.g),
                        hardMix(base.b, blend.b)
                    );
                    return (blended * opacity + base * (1.0 - opacity));
                }
            `,
        main: `
                out = vec4<f32>(blendHardMix(back.rgb, front.rgb, front.a), blendUniforms.uBlend);
            `
      }
    });
  }
}

export { HardMixBlend };
//# sourceMappingURL=HardMixBlend.mjs.map
