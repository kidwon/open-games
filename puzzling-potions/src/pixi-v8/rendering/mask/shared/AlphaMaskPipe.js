'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var FilterEffect = require('../../filters/FilterEffect.js');
var MaskFilter = require('../../filters/mask/MaskFilter.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var TexturePool = require('../../renderers/shared/texture/TexturePool.js');
var Bounds = require('../../scene/bounds/Bounds.js');
var getGlobalBounds = require('../../scene/bounds/getGlobalBounds.js');
var buildInstructions = require('../../scene/utils/buildInstructions.js');
var Sprite = require('../../sprite/shared/Sprite.js');

const tempBounds = new Bounds.Bounds();
class AlphaMaskEffect extends FilterEffect.FilterEffect {
  constructor() {
    super({
      filters: [new MaskFilter.MaskFilter({
        sprite: new Sprite.Sprite(Texture.Texture.EMPTY)
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
      buildInstructions.collectAllRenderables(
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
      const filterEffect = PoolGroup.BigPool.get(AlphaMaskEffect);
      if (renderMask) {
        instruction.mask.mask.measurable = true;
        const bounds = getGlobalBounds.getGlobalBounds(instruction.mask.mask, true, tempBounds);
        instruction.mask.mask.measurable = false;
        bounds.ceil();
        const filterTexture = TexturePool.TexturePool.getOptimalTexture(
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
        TexturePool.TexturePool.returnTexture(maskData.filterTexture);
      }
      PoolGroup.BigPool.return(maskData.filterEffect);
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
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "alphaMask"
};

exports.AlphaMaskPipe = AlphaMaskPipe;
//# sourceMappingURL=AlphaMaskPipe.js.map
