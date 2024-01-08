'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GlProgram = require('../../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var Filter = require('../Filter.js');
var noise$2 = require('./noise3.js');
var noise$1 = require('./noise2.js');
var noise = require('./noise.js');

const _NoiseFilter = class extends Filter.Filter {
  /**
   * @param options
   */
  constructor(options = {}) {
    options = { ..._NoiseFilter.DEFAULT, ...options };
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: noise["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: noise["default"],
        entryPoint: "mainFragment"
      }
    });
    const glProgram = new GlProgram.GlProgram({
      vertex: noise$1["default"],
      fragment: noise$2["default"],
      name: "noise-filter"
    });
    super({
      gpuProgram,
      glProgram,
      resources: {
        noiseUniforms: new UniformGroup.UniformGroup({
          uNoise: { value: options.noise, type: "f32" },
          uSeed: { value: options.seed ?? Math.random(), type: "f32" }
        })
      },
      resolution: 1
    });
    const noise$3 = options.noise ?? 0.5;
    const seed = options.seed ?? Math.random();
    this.noise = noise$3;
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

exports.NoiseFilter = NoiseFilter;
//# sourceMappingURL=NoiseFilter.js.map
