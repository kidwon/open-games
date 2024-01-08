import { Filter } from '../../rendering/filters/Filter.mjs';
import { GlProgram } from '../../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../rendering/renderers/shared/shader/UniformGroup.mjs';
import fragment from './shockwave3.mjs';
import vertex from './shockwave2.mjs';
import source from './shockwave.mjs';

const _ShockwaveFilter = class extends Filter {
  /**
   * @param options
   */
  constructor(options = {}) {
    options = { ..._ShockwaveFilter.DEFAULT, ...options };
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
      name: "shockwave-filter"
    });
    super({
      gpuProgram,
      glProgram,
      resources: {
        shockwaveUniforms: new UniformGroup({
          uTime: { value: 0, type: "f32" },
          uCenter: { value: options.center, type: "vec2<f32>" },
          uSpeed: { value: options.speed, type: "f32" },
          uWave: { value: new Float32Array(4), type: "vec4<f32>" }
        })
      },
      resolution: 1
    });
    this.time = 0;
    this.uniforms = this.resources.shockwaveUniforms.uniforms;
    Object.assign(this, options);
  }
  apply(filterManager, input, output, clearMode) {
    this.uniforms.uTime = this.time;
    filterManager.applyFilter(this, input, output, clearMode);
  }
  /**
   * The `x` and `y` center coordinates to change the position of the center of the circle of effect.
   * @default [0,0]
   */
  get center() {
    return this.uniforms.uCenter;
  }
  set center(value) {
    this.uniforms.uCenter = value;
  }
  /**
   * Sets the center of the effect in normalized screen coords on the `x` axis
   * @default 0
   */
  get centerX() {
    return this.uniforms.uCenter.x;
  }
  set centerX(value) {
    this.uniforms.uCenter.x = value;
  }
  /**
   * Sets the center of the effect in normalized screen coords on the `y` axis
   * @default 0
   */
  get centerY() {
    return this.uniforms.uCenter.y;
  }
  set centerY(value) {
    this.uniforms.uCenter.y = value;
  }
  /**
   * The speed about the shockwave ripples out. The unit is `pixel-per-second`
   * @default 500
   */
  get speed() {
    return this.uniforms.uSpeed;
  }
  set speed(value) {
    this.uniforms.uSpeed = value;
  }
  /**
   * The amplitude of the shockwave
   * @default 30
   */
  get amplitude() {
    return this.uniforms.uWave[0];
  }
  set amplitude(value) {
    this.uniforms.uWave[0] = value;
  }
  /**
   * The wavelength of the shockwave
   * @default 160
   */
  get wavelength() {
    return this.uniforms.uWave[1];
  }
  set wavelength(value) {
    this.uniforms.uWave[1] = value;
  }
  /**
   * The brightness of the shockwave
   * @default 1
   */
  get brightness() {
    return this.uniforms.uWave[2];
  }
  set brightness(value) {
    this.uniforms.uWave[2] = value;
  }
  /**
   * The maximum radius of shockwave. less than `0` means the max is an infinite distance
   * @default -1
   */
  get radius() {
    return this.uniforms.uWave[3];
  }
  set radius(value) {
    this.uniforms.uWave[3] = value;
  }
};
let ShockwaveFilter = _ShockwaveFilter;
ShockwaveFilter.DEFAULT = {
  center: { x: 0, y: 0 },
  speed: 500,
  amplitude: 30,
  wavelength: 160,
  brightness: 1,
  radius: -1
};

export { ShockwaveFilter };
//# sourceMappingURL=ShockwaveFilter.mjs.map
