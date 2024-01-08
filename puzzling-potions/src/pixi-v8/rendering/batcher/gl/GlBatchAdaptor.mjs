import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { batchSamplersUniformGroup } from '../../renderers/gl/shader/batchSamplersUniformGroup.mjs';
import { Shader } from '../../renderers/shared/shader/Shader.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { MAX_TEXTURES } from '../shared/const.mjs';
import { generateDefaultBatchGlProgram } from './generateDefaultBatchGlProgram.mjs';

class GlBatchAdaptor {
  constructor() {
    this.didUpload = false;
  }
  init() {
    const uniforms = new UniformGroup({
      tint: { value: new Float32Array([1, 1, 1, 1]), type: "f32" },
      translationMatrix: { value: new Matrix(), type: "mat3x3<f32>" }
    });
    this.shader = new Shader({
      glProgram: generateDefaultBatchGlProgram(MAX_TEXTURES),
      resources: {
        uniforms,
        batchSamplers: batchSamplersUniformGroup
      }
    });
  }
  execute(batchPipe, batch) {
    const renderer = batchPipe.renderer;
    batchPipe.state.blendMode = batch.blendMode;
    renderer.state.set(batchPipe.state);
    renderer.shader.bind(this.shader, this.didUpload);
    this.didUpload = true;
    const activeBatcher = batch.batchParent;
    renderer.geometry.bind(activeBatcher.geometry, this.shader.glProgram);
    for (let i = 0; i < batch.textures.textures.length; i++) {
      renderer.texture.bind(batch.textures.textures[i], i);
    }
    renderer.shader.bindUniformBlock(renderer.globalUniforms.uniformGroup, "globalUniforms", 0);
    renderer.geometry.draw("triangle-list", batch.size, batch.start);
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GlBatchAdaptor.extension = {
  type: [
    ExtensionType.WebGLPipesAdaptor
  ],
  name: "batch"
};

export { GlBatchAdaptor };
//# sourceMappingURL=GlBatchAdaptor.mjs.map
