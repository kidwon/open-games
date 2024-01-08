import { GlProgram } from '../../renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';
import { Shader } from '../../renderers/shared/shader/Shader.mjs';
import programFrag from '../gl/mesh-default.mjs';
import programVert from '../gl/mesh-default2.mjs';
import programWgsl from '../gpu/mesh-default.mjs';

class MeshShader extends Shader {
  constructor(options) {
    const glProgram = GlProgram.from({
      vertex: programVert,
      fragment: programFrag,
      name: "mesh-default"
    });
    const gpuProgram = GpuProgram.from({
      vertex: {
        source: programWgsl,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: programWgsl,
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

export { MeshShader };
//# sourceMappingURL=MeshShader.mjs.map
