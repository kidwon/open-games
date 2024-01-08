import { Matrix } from '../../../maths/Matrix.mjs';
import { MAX_TEXTURES } from '../../batcher/shared/const.mjs';
import { Filter } from '../../filters/Filter.mjs';
import { batchSamplersUniformGroup } from '../../renderers/gl/shader/batchSamplersUniformGroup.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { generateDefaultSdfBatchGlProgram } from './generateDefaultSdfBatchGlProgram.mjs';
import { generateDefaultSdfBatchProgram } from './generateDefaultSdfBatchProgram.mjs';

class SdfShader extends Filter {
  constructor() {
    const uniforms = new UniformGroup({
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      transformMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      distance: { value: 4, type: "f32" }
    });
    super({
      glProgram: generateDefaultSdfBatchGlProgram(MAX_TEXTURES),
      gpuProgram: generateDefaultSdfBatchProgram(MAX_TEXTURES),
      resources: {
        localUniforms: uniforms,
        batchSamplers: batchSamplersUniformGroup
      }
    });
  }
}

export { SdfShader };
//# sourceMappingURL=SdfShader.mjs.map
