import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { BigPool } from '../../../utils/pool/PoolGroup.mjs';
import { FilterEffect } from '../../filters/FilterEffect.mjs';
import { MaskFilter } from '../../filters/mask/MaskFilter.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { TexturePool } from '../../renderers/shared/texture/TexturePool.mjs';
import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { getGlobalBounds } from '../../scene/bounds/getGlobalBounds.mjs';
import { collectAllRenderables } from '../../scene/utils/buildInstructions.mjs';
import { Sprite } from '../../sprite/shared/Sprite.mjs';

const tempBounds = new Bounds();
class AlphaMaskEffect extends FilterEffect {
  constructor() {
    super({
      filters: [new MaskFilter({
        sprite: new Sprite(Texture.EMPTY)
      })]
    });
  }
  get sprite() {
    return this.filters[0].sprite;
  }
  set sprite(value) {
    this.filters[0].sprite = value;
  }
}
class AlphaMaskPipe {
  constructor(renderer) {
    this.activeMaskStage = [];
    this.renderer = renderer;
  }
  push(mask, maskedContainer, instructionSet) {
    const renderer = this.renderer;
    renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "alphaMask",
      action: "pushMaskBegin",
      mask,
      canBundle: false,
      maskedContainer
    });
    if (mask.renderMaskToTexture) {
      const maskContainer = mask.mask;
      maskContainer.includeInBuild = true;
      collectAllRenderables(
        maskContainer,
        instructionSet,
        renderer.renderPipes
      );
      maskContainer.includeInBuild = false;
    }
    renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "alphaMask",
      action: "pushMaskEnd",
      mask,
      maskedContainer,
      canBundle: false
    });
  }
  pop(mask, _maskedContainer, instructionSet) {
    const renderer = this.renderer;
    renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "alphaMask",
      action: "popMaskEnd",
      mask,
      canBundle: false
    });
  }
  execute(instruction) {
    const renderer = this.renderer;
    const renderMask = instruction.mask.renderMaskToTexture;
    if (instruction.action === "pushMaskBegin") {
      const filterEffect = BigPool.get(AlphaMaskEffect);
      if (renderMask) {
        instruction.mask.mask.measurable = true;
        const bounds = getGlobalBounds(instruction.mask.mask, true, tempBounds);
        instruction.mask.mask.measurable = false;
        bounds.ceil();
        const filterTexture = TexturePool.getOptimalTexture(
          bounds.width,
          bounds.height,
          1,
          false
        );
        const renderTarget = renderer.renderTarget.push(filterTexture, true);
        renderer.globalUniforms.push({
          projectionMatrix: renderTarget.projectionMatrix,
          offset: bounds,
          worldColor: 4294967295
        });
        const sprite = filterEffect.sprite;
        sprite.texture = filterTexture;
        sprite.worldTransform.tx = bounds.minX;
        sprite.worldTransform.ty = bounds.minY;
        this.activeMaskStage.push({
          filterEffect,
          maskedContainer: instruction.maskedContainer,
          filterTexture
        });
      } else {
        filterEffect.sprite = instruction.mask.mask;
        this.activeMaskStage.push({
          filterEffect,
          maskedContainer: instruction.maskedContainer
        });
      }
    } else if (instruction.action === "pushMaskEnd") {
      const maskData = this.activeMaskStage[this.activeMaskStage.length - 1];
      if (renderMask) {
        renderer.renderTarget.pop();
        renderer.globalUniforms.pop();
      }
      renderer.filter.push({
        type: "filter",
        action: "pushFilter",
        container: maskData.maskedContainer,
        filterEffect: maskData.filterEffect,
        canBundle: false
      });
    } else if (instruction.action === "popMaskEnd") {
      renderer.filter.pop();
      const maskData = this.activeMaskStage.pop();
      if (renderMask) {
        TexturePool.returnTexture(maskData.filterTexture);
      }
      BigPool.return(maskData.filterEffect);
    }
  }
  destroy() {
    this.renderer = null;
    this.activeMaskStage = null;
  }
}
/** @ignore */
AlphaMaskPipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "alphaMask"
};

export { AlphaMaskPipe };
//# sourceMappingURL=AlphaMaskPipe.mjs.map
