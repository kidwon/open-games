'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Sprite = require('../../sprite/shared/Sprite.js');
var addMaskBounds = require('./addMaskBounds.js');
var addMaskLocalBounds = require('./addMaskLocalBounds.js');

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
    this.renderMaskToTexture = !(mask instanceof Sprite.Sprite);
    this.mask.renderable = this.renderMaskToTexture;
    this.mask.includeInBuild = !this.renderMaskToTexture;
    this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true;
    this.mask = null;
  }
  addBounds(bounds, skipUpdateTransform) {
    addMaskBounds.addMaskBounds(this.mask, bounds, skipUpdateTransform);
  }
  addLocalBounds(bounds, localRoot) {
    addMaskLocalBounds.addMaskLocalBounds(this.mask, bounds, localRoot);
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
    return mask instanceof Sprite.Sprite;
  }
}
AlphaMask.extension = Extensions.ExtensionType.MaskEffect;

exports.AlphaMask = AlphaMask;
//# sourceMappingURL=AlphaMask.js.map
