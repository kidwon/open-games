'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Container = require('../../scene/Container.js');
var addMaskBounds = require('./addMaskBounds.js');
var addMaskLocalBounds = require('./addMaskLocalBounds.js');

class StencilMask {
  constructor(options) {
    this.priority = 0;
    this.pipe = "stencilMask";
    if (options?.mask) {
      this.init(options.mask);
    }
  }
  init(mask) {
    this.mask = mask;
    this.mask.includeInBuild = false;
    this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true;
    this.mask.includeInBuild = true;
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
    return mask instanceof Container.Container;
  }
}
StencilMask.extension = Extensions.ExtensionType.MaskEffect;

exports.StencilMask = StencilMask;
//# sourceMappingURL=StencilMask.js.map
