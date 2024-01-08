'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var addMaskBounds = require('./addMaskBounds.js');
var addMaskLocalBounds = require('./addMaskLocalBounds.js');

class ScissorMask {
  constructor(mask) {
    this.priority = 0;
    this.pipe = "scissorMask";
    this.mask = mask;
    this.mask.renderable = false;
    this.mask.measurable = false;
    this.renderMask = false;
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
  reset() {
    this.mask.measurable = true;
    this.mask = null;
  }
  destroy() {
    this.reset();
  }
}

exports.ScissorMask = ScissorMask;
//# sourceMappingURL=ScissorMask.js.map
