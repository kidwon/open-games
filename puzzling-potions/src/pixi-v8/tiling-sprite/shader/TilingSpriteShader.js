'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../maths/Matrix.js');
var GlProgram = require('../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../rendering/renderers/gpu/shader/GpuProgram.js');
var Shader = require('../../rendering/renderers/shared/shader/Shader.js');
var UniformGroup = require('../../rendering/renderers/shared/shader/UniformGroup.js');
var tilingSprite$1 = require('./tiling-sprite.js');
var tilingSprite = require('./tiling-sprite2.js');
var tilingSprite$2 = require('./tiling-sprite3.js');

class TilingSpriteShader extends Shader.Shader {
  constructor(options) {
    const glProgram = GlProgram.GlProgram.from({
      vertex: tilingSprite["default"],
      fragment: tilingSprite$1["default"],
      name: "tiling-sprite"
    });
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: tilingSprite$2["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: tilingSprite$2["default"],
        entryPoint: "mainFragment"
      }
    });
    const tilingUniforms = new UniformGroup.UniformGroup({
      uMapCoord: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      uSizeAnchor: { value: new Float32Array([100, 200, 0.5, 0.5]), type: "vec4<f32>" }
    });
    super({
      glProgram,
      gpuProgram,
      resources: {
        tilingUniforms,
        uTexture: options.texture.source,
        uSampler: options.texture.style
      }
    });
  }
  get texture() {
    return this._texture;
  }
  set texture(value) {
    if (this._texture === value)
      return;
    this._texture = value;
    this.resources.uTexture = value.source;
    this.resources.uSampler = value.style;
  }
}

exports.TilingSpriteShader = TilingSpriteShader;
//# sourceMappingURL=TilingSpriteShader.js.map
