'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var Filter = require('../Filter.js');
var alpha = require('./alpha.js');

const _AlphaFilter = class extends Filter.Filter {
  constructor(options) {
    options = { ..._AlphaFilter.DEFAULT_OPTIONS, ...options };
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: alpha["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: alpha["default"],
        entryPoint: "mainFragment"
      }
    });
    const filterUniforms = new UniformGroup.UniformGroup({
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

exports.AlphaFilter = AlphaFilter;
//# sourceMappingURL=AlphaFilter.js.map
