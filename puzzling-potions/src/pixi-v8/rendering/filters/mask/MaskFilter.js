'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var GlProgram = require('../../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var TextureMatrix = require('../../renderers/shared/texture/TextureMatrix.js');
var Filter = require('../Filter.js');
var mask$2 = require('./mask3.js');
var mask$1 = require('./mask.js');
var mask = require('./mask2.js');

class MaskFilter extends Filter.Filter {
  constructor({ sprite }) {
    const textureMatrix = new TextureMatrix.TextureMatrix(sprite.texture);
    const filterUniforms = new UniformGroup.UniformGroup({
      filterMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      maskClamp: { value: textureMatrix.uClampFrame, type: "vec4<f32>" },
      alpha: { value: 1, type: "f32" }
    });
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: mask["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: mask["default"],
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: mask$1["default"],
      fragment: mask$2["default"],
      name: "mask-filter"
    });
    super({
      gpuProgram,
      glProgram,
      resources: {
        filterUniforms,
        mapTexture: sprite.texture.source
      }
    });
    this.sprite = sprite;
    this.textureMatrix = textureMatrix;
  }
  apply(filterManager, input, output, clearMode) {
    this.textureMatrix.texture = this.sprite.texture;
    filterManager.calculateSpriteMatrix(
      this.resources.filterUniforms.uniforms.filterMatrix,
      this.sprite
    ).prepend(this.textureMatrix.mapCoord);
    this.resources.mapTexture = this.sprite.texture.source;
    filterManager.applyFilter(this, input, output, clearMode);
  }
}

exports.MaskFilter = MaskFilter;
//# sourceMappingURL=MaskFilter.js.map
