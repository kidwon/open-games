import { Matrix } from '../../maths/Matrix.mjs';
import { GlProgram } from '../../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { Shader } from '../../rendering/renderers/shared/shader/Shader.mjs';
import { UniformGroup } from '../../rendering/renderers/shared/shader/UniformGroup.mjs';
import programFrag from './tiling-sprite.mjs';
import programVert from './tiling-sprite2.mjs';
import programWgsl from './tiling-sprite3.mjs';

class TilingSpriteShader extends Shader {
  constructor(options) {
    const glProgram = GlProgram.from({
      vertex: programVert,
      fragment: programFrag,
      name: "tiling-sprite"
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
    const tilingUniforms = new UniformGroup({
      uMapCoord: { value: new Matrix(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new Matrix(), type: "mat3x3<f32>" },
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

export { TilingSpriteShader };
//# sourceMappingURL=TilingSpriteShader.mjs.map
