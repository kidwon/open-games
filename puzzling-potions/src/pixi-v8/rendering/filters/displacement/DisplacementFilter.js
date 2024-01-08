'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var Point = require('../../../maths/Point.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var Filter = require('../Filter.js');
var displacement = require('./displacement.js');

class DisplacementFilter extends Filter.Filter {
  constructor(options) {
    let scale = options.scale || 20;
    const filterUniforms = new UniformGroup.UniformGroup({
      filterMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      scale: { value: scale, type: "vec2<f32>" },
      rotation: { value: new Float32Array([0, 0, 0, 0]), type: "vec4<f32>" }
    });
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: displacement["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: displacement["default"],
        entryPoint: "mainFragment"
      }
    });
    const texture = options.sprite.texture;
    super({
      gpuProgram,
      resources: {
        filterUniforms,
        mapTexture: texture.source,
        mapStyle: texture.style
      }
    });
    this.sprite = options.sprite;
    this.sprite.renderable = false;
    if (typeof scale === "number") {
      scale = new Point.Point(scale, scale);
    }
  }
  apply(filterManager, input, output, clearMode) {
    filterManager.calculateSpriteMatrix(
      this.uniformGroup.uniforms.filterMatrix,
      this.sprite
    );
    const wt = this.sprite.worldTransform;
    const lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b);
    const lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
    const uniforms = this.resources.filterUniforms.uniforms;
    if (lenX !== 0 && lenY !== 0) {
      uniforms.rotation[0] = wt.a / lenX;
      uniforms.rotation[1] = wt.b / lenX;
      uniforms.rotation[2] = wt.c / lenY;
      uniforms.rotation[3] = wt.d / lenY;
    }
    this.uniformGroup.update();
    this.resources.mapTexture = this.sprite.texture.source;
    filterManager.applyFilter(this, input, output, clearMode);
  }
  get scale() {
    return this.uniformGroup.uniforms.scale;
  }
}

exports.DisplacementFilter = DisplacementFilter;
//# sourceMappingURL=DisplacementFilter.js.map
