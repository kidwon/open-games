import { GlProgram } from '../../renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { Filter } from '../Filter.mjs';
import fragment from './noise3.mjs';
import vertex from './noise2.mjs';
import source from './noise.mjs';

const _NoiseFilter = class extends Filter {
  /**
   * @param options
   */
  constructor(options = {}) {
    options = { ..._NoiseFilter.DEFAULT, ...options };
    const gpuProgram = new GpuProgram({
      vertex: {
        source,
        entryPoint: "mainVertex"
      },
      fragment: {
        source,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = new GlProgram({
      vertex,
      fragment,
      name: "noise-filter"
    });
    super({
      gpuProgram,
      glProgram,
      resources: {
        noiseUniforms: new UniformGroup({
          uNoise: { value: options.noise, type: "f32" },
          uSeed: { value: options.seed ?? Math.random(), type: "f32" }
        })
      },
      resolution: 1
    });
    const noise = options.noise ?? 0.5;
    const seed = options.seed ?? Math.random();
    this.noise = noise;
    this.seed = seed;
  }
  /**
   * The amount of noise to apply, this value should be in the range (0, 1].
   * @default 0.5
   */
  get noise() {
    return this.resources.noiseUniforms.uniforms.uNoise;
  }
  set noise(value) {
    this.resources.noiseUniforms.uniforms.uNoise = value;
  }
  /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
  get seed() {
    return this.resources.noiseUniforms.uniforms.uSeed;
  }
  set seed(value) {
    this.resources.noiseUniforms.uniforms.uSeed = value;
  }
};
let NoiseFilter = _NoiseFilter;
NoiseFilter.DEFAULT = {
  noise: 0.5,
  seed: void 0
};

export { NoiseFilter };
//# sourceMappingURL=NoiseFilter.mjs.map
