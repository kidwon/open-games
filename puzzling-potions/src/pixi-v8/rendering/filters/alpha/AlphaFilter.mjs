import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { Filter } from '../Filter.mjs';
import source from './alpha.mjs';

const _AlphaFilter = class extends Filter {
  constructor(options) {
    options = { ..._AlphaFilter.DEFAULT_OPTIONS, ...options };
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
    const filterUniforms = new UniformGroup({
      uAlpha: { value: options.alpha, type: "f32" }
    });
    super({
      gpuProgram,
      resources: {
        filterUniforms
      }
    });
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.resources.filterUniforms.uniforms.uAlpha;
  }
  set alpha(value) {
    this.resources.filterUniforms.uniforms.uAlpha = value;
  }
};
let AlphaFilter = _AlphaFilter;
AlphaFilter.DEFAULT_OPTIONS = {
  alpha: 1
};

export { AlphaFilter };
//# sourceMappingURL=AlphaFilter.mjs.map
