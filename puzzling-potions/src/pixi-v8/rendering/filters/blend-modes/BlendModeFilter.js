'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GlProgram = require('../../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var Filter = require('../Filter.js');
var blendTemplate$1 = require('./blend-template3.js');
var blendTemplate$2 = require('./blend-template.js');
var blendTemplate = require('./blend-template2.js');

class BlendModeFilter extends Filter.Filter {
  constructor(options) {
    const gpuOptions = options.gpu;
    const gpuSource = compileBlendModeShader({ source: blendTemplate["default"], ...gpuOptions });
    const gpuProgram = new GpuProgram.GpuProgram({
      vertex: {
        source: gpuSource,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: gpuSource,
        entryPoint: "mainFragment"
      }
    });
    const glOptions = options.gl;
    const glSource = compileBlendModeShader({ source: blendTemplate$1["default"], ...glOptions });
    const glProgram = new GlProgram.GlProgram({
      vertex: blendTemplate$2["default"],
      fragment: glSource
    });
    const uniformGroup = new UniformGroup.UniformGroup({
      uBlend: {
        value: 1,
        type: "f32"
      }
    });
    super({
      gpuProgram,
      glProgram,
      blendRequired: true,
      resources: {
        blendUniforms: uniformGroup,
        backTexture: Texture.Texture.EMPTY
      }
    });
  }
}
function compileBlendModeShader(options) {
  const { source, functions, main } = options;
  return source.replace("{FUNCTIONS}", functions).replace("{MAIN}", main);
}

exports.BlendModeFilter = BlendModeFilter;
//# sourceMappingURL=BlendModeFilter.js.map
