import { GlProgram } from '../../renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { Filter } from '../Filter.mjs';
import blendTemplateFrag from './blend-template3.mjs';
import blendTemplateVert from './blend-template.mjs';
import blendTemplate from './blend-template2.mjs';

class BlendModeFilter extends Filter {
  constructor(options) {
    const gpuOptions = options.gpu;
    const gpuSource = compileBlendModeShader({ source: blendTemplate, ...gpuOptions });
    const gpuProgram = new GpuProgram({
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
    const glSource = compileBlendModeShader({ source: blendTemplateFrag, ...glOptions });
    const glProgram = new GlProgram({
      vertex: blendTemplateVert,
      fragment: glSource
    });
    const uniformGroup = new UniformGroup({
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
        backTexture: Texture.EMPTY
      }
    });
  }
}
function compileBlendModeShader(options) {
  const { source, functions, main } = options;
  return source.replace("{FUNCTIONS}", functions).replace("{MAIN}", main);
}

export { BlendModeFilter };
//# sourceMappingURL=BlendModeFilter.mjs.map
