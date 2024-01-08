'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GlProgram = require('../../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var Shader = require('../../renderers/shared/shader/Shader.js');
var meshDefault$1 = require('../gl/mesh-default.js');
var meshDefault = require('../gl/mesh-default2.js');
var meshDefault$2 = require('../gpu/mesh-default.js');

class MeshShader extends Shader.Shader {
  constructor(options) {
    const glProgram = GlProgram.GlProgram.from({
      vertex: meshDefault["default"],
      fragment: meshDefault$1["default"],
      name: "mesh-default"
    });
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: meshDefault$2["default"],
        entryPoint: "mainVertex"
      },
      fragment: {
        source: meshDefault$2["default"],
        entryPoint: "mainFragment"
      }
    });
    super({
      glProgram,
      gpuProgram,
      resources: {
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

exports.MeshShader = MeshShader;
//# sourceMappingURL=MeshShader.js.map
