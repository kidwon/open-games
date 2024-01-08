'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var Bounds = require('../../scene/bounds/Bounds.js');
var getLocalBounds = require('../../scene/bounds/getLocalBounds.js');
var updateLocalTransform = require('../../scene/utils/updateLocalTransform.js');

function addMaskLocalBounds(mask, bounds, localRoot) {
  const boundsToMask = new Bounds.Bounds();
  mask.measurable = true;
  const relativeMask = getMatrixRelativeToParent(mask, localRoot, new Matrix.Matrix());
  getLocalBounds.getLocalBounds(mask, boundsToMask, relativeMask);
  mask.measurable = false;
  bounds.addBoundsMask(boundsToMask);
}
function getMatrixRelativeToParent(target, root, matrix) {
  if (!target) {
    console.warn("Item is not inside the root container");
    return matrix;
  }
  if (target !== root) {
    getMatrixRelativeToParent(target.parent, root, matrix);
    if (target.didChange) {
      updateLocalTransform.updateLocalTransform(target.localTransform, target);
    }
    matrix.append(target.localTransform);
  }
  return matrix;
}

exports.addMaskLocalBounds = addMaskLocalBounds;
exports.getMatrixRelativeToParent = getMatrixRelativeToParent;
//# sourceMappingURL=addMaskLocalBounds.js.map
