'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Bounds = require('../../scene/bounds/Bounds.js');
var getGlobalBounds = require('../../scene/bounds/getGlobalBounds.js');

const tempBounds = new Bounds.Bounds();
function addMaskBounds(mask, bounds, skipUpdateTransform) {
  const boundsToMask = tempBounds;
  mask.measurable = true;
  getGlobalBounds.getGlobalBounds(mask, skipUpdateTransform, boundsToMask);
  bounds.addBoundsMask(boundsToMask);
  mask.measurable = false;
}

exports.addMaskBounds = addMaskBounds;
exports.tempBounds = tempBounds;
//# sourceMappingURL=addMaskBounds.js.map
