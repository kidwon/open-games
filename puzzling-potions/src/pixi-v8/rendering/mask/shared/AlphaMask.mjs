import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Sprite } from '../../sprite/shared/Sprite.mjs';
import { addMaskBounds } from './addMaskBounds.mjs';
import { addMaskLocalBounds } from './addMaskLocalBounds.mjs';

class AlphaMask {
  constructor(options) {
    this.priority = 0;
    this.pipe = "alphaMask";
    if (options?.mask) {
      this.init(options.mask);
    }
  }
  init(mask) {
    this.mask = mask;
    this.renderMaskToTexture = !(mask instanceof Sprite);
    this.mask.renderable = this.renderMaskToTexture;
    this.mask.includeInBuild = !this.renderMaskToTexture;
    this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true;
    this.mask = null;
  }
  addBounds(bounds, skipUpdateTransform) {
    addMaskBounds(this.mask, bounds, skipUpdateTransform);
  }
  addLocalBounds(bounds, localRoot) {
    addMaskLocalBounds(this.mask, bounds, localRoot);
  }
  containsPoint(point) {
    const mask = this.mask;
    if (mask.containsPoint) {
      return mask.containsPoint(point);
    }
    return false;
  }
  destroy() {
    this.reset();
  }
  static test(mask) {
    return mask instanceof Sprite;
  }
}
AlphaMask.extension = ExtensionType.MaskEffect;

export { AlphaMask };
//# sourceMappingURL=AlphaMask.mjs.map
