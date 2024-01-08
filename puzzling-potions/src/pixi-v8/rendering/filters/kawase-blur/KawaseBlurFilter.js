'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Point = require('../../../maths/Point.js');
var GlProgram = require('../../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
require('../../renderers/shared/texture/TexturePool.js');
var Filter = require('../Filter.js');
var kawaseBlur$2 = require('./kawase-blur3.js');
var kawaseBlur$1 = require('./kawase-blur.js');
var kawaseBlur = require('./kawase-blur2.js');

const _KawaseBlurFilter = class extends Filter.Filter {
  /**
   * @param options
   */
  constructor(options = {}) {
    options = { ..._KawaseBlurFilter.DEFAULT, ...options };
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: kawaseBlur["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: kawaseBlur["default"],
        entryPoint: "mainFragment"
      }
    });
    const glProgram = new GlProgram.GlProgram({
      vertex: kawaseBlur$1["default"],
      fragment: kawaseBlur$2["default"],
      name: "noise-filter"
    });
    super({
      gpuProgram,
      glProgram,
      resources: {
        kawaseUniforms: new UniformGroup.UniformGroup({
          uOffset: { value: { x: 0, y: 0 }, type: "vec2<f32>" }
        })
      },
      resolution: 1
    });
    this._pixelSize = new Point.Point();
    this._kernels = [];
    this._pixelSize.x = options.pixelSize.x;
    this._pixelSize.y = options.pixelSize.y;
    this.kernels = options.strength;
    this._blur = options.strength;
    this.quality = options.quality;
    this._clamp = options.clamp;
  }
  apply(filterManager, input, output, clear) {
    const pixelSizeX = this._pixelSize.x;
    const pixelSizeY = this._pixelSize.y;
    const uvX = pixelSizeX / input.source.width;
    const uvY = pixelSizeY / input.source.height;
    let offset;
    const uniforms = this.resources.kawaseUniforms.uniforms;
    if (true) {
      offset = this._kernels[0] + 0.5;
      uniforms.uOffset.x = offset * uvX;
      uniforms.uOffset.y = offset * uvY;
      console.log(uniforms.uOffset.x);
      filterManager.applyFilter(this, input, output, clear);
    } else {
      const renderTarget = TexturePool.getOptimalTexture(input.width, input.height, 1, false);
      let source2 = input;
      let target = renderTarget;
      let tmp;
      const last = this._quality - 1;
      for (let i = 0; i < last; i++) {
        offset = this._kernels[i] + 0.5;
        uniforms.uOffset[0] = offset * uvX;
        uniforms.uOffset[1] = offset * uvY;
        filterManager.applyFilter(this, source2, target, true);
        tmp = source2;
        source2 = target;
        target = tmp;
      }
      offset = this._kernels[last] + 0.5;
      uniforms.uOffset[0] = offset * uvX;
      uniforms.uOffset[1] = offset * uvY;
      filterManager.applyFilter2(this, source2, output, clear);
      TexturePool.returnTexture(renderTarget);
    }
  }
  /**
   * The amount of blur, value greater than `0`.
   * @default 4
   */
  get strength() {
    return this._blur;
  }
  set strength(value) {
    this._blur = value;
    this._generateKernels();
  }
  /**
   * The quality of the filter, integer greater than `1`.
   * @default 3
   */
  get quality() {
    return this._quality;
  }
  set quality(value) {
    this._quality = Math.max(1, Math.round(value));
    this._generateKernels();
  }
  /**
   * The kernel size of the blur filter, for advanced usage
   * @default [0]
   */
  get kernels() {
    return this._kernels;
  }
  set kernels(value) {
    if (Array.isArray(value) && value.length > 0) {
      this._kernels = value;
      this._quality = value.length;
      this._blur = Math.max(...value);
    } else {
      this._kernels = [0];
      this._quality = 1;
    }
  }
  /**
   * The size of the pixels. Large size is blurrier. For advanced usage.
   * @default [1,1]
   */
  get pixelSize() {
    return this._pixelSize;
  }
  set pixelSize(value) {
    this._pixelSize.x = value.x;
    this._pixelSize.y = value.y;
  }
  /**
   * The size of the pixels on the `x` axis. Large size is blurrier. For advanced usage.
   * @default 1
   */
  get pixelSizeX() {
    return this._pixelSize.x;
  }
  set pixelSizeX(value) {
    this._pixelSize.x = value;
  }
  /**
   * The size of the pixels on the `y` axis. Large size is blurrier. For advanced usage.
   * @default 1
   */
  get pixelSizeY() {
    return this._pixelSize.y;
  }
  set pixelSizeY(value) {
    this._pixelSize.y = value;
  }
  /**
   * Get the if the filter is clamped
   * @default false
   */
  get clamp() {
    return this._clamp;
  }
  /** Update padding based on kernel data */
  _updatePadding() {
    this.padding = Math.ceil(this._kernels.reduce((acc, v) => acc + v + 0.5, 0));
  }
  /** Auto generate kernels by blur & quality */
  _generateKernels() {
    const blur = this._blur;
    const quality = this._quality;
    const kernels = [blur];
    if (blur > 0) {
      let k = blur;
      const step = blur / quality;
      for (let i = 1; i < quality; i++) {
        k -= step;
        kernels.push(k);
      }
    }
    this.kernels = kernels;
    this._updatePadding();
  }
};
let KawaseBlurFilter = _KawaseBlurFilter;
KawaseBlurFilter.DEFAULT = {
  strength: 4,
  quality: 3,
  clamp: false,
  pixelSize: { x: 1, y: 1 }
};

exports.KawaseBlurFilter = KawaseBlurFilter;
//# sourceMappingURL=KawaseBlurFilter.js.map
