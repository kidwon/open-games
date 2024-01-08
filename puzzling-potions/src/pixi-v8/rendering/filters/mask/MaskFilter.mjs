import { Matrix } from '../../../maths/Matrix.mjs';
import { GlProgram } from '../../renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { TextureMatrix } from '../../renderers/shared/texture/TextureMatrix.mjs';
import { Filter } from '../Filter.mjs';
import fragment from './mask3.mjs';
import vertex from './mask.mjs';
import source from './mask2.mjs';

class MaskFilter extends Filter {
  constructor({ sprite }) {
    const textureMatrix = new TextureMatrix(sprite.texture);
    const filterUniforms = new UniformGroup({
      filterMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      maskClamp: { value: textureMatrix.uClampFrame, type: "vec4<f32>" },
      alpha: { value: 1, type: "f32" }
    });
    const gpuProgram = new GpuProgram({
      vertex: {
        source,
        entryPoint: "mainVertex"
      },
      fragment: {
        source,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.from({
      vertex,
      fragment,
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

export { MaskFilter };
//# sourceMappingURL=MaskFilter.mjs.map
