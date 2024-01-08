'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var updateLocalTransform = require('../utils/updateLocalTransform.js');

function getGlobalBounds(target, skipUpdateTransform, bounds) {
  bounds.clear();
  let parentTransform;
  if (target.parent) {
    if (!skipUpdateTransform) {
      parentTransform = updateTransformBackwards(target, new Matrix.Matrix());
    } else {
      parentTransform = target.parent.worldTransform;
    }
  } else {
    parentTransform = Matrix.Matrix.IDENTITY;
  }
  _getGlobalBounds(target, bounds, parentTransform, skipUpdateTransform);
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  return bounds;
}
function _getGlobalBounds(target, bounds, parentTransform, skipUpdateTransform) {
  if (!target.visible || !target.measurable)
    return;
  let worldTransform;
  if (!skipUpdateTransform) {
    if (target.didChange) {
      updateLocalTransform.updateLocalTransform(target.localTransform, target);
    }
    worldTransform = Matrix.Matrix.shared.appendFrom(target.localTransform, parentTransform).clone();
  } else {
    worldTransform = target.worldTransform;
  }
  const parentBounds = bounds;
  const preserveBounds = !!target.effects.length;
  if (preserveBounds) {
    bounds = bounds.clone();
  }
  if (target.view) {
    bounds.setMatrix(worldTransform);
    target.view.addBounds(bounds);
  }
  for (let i = 0; i < target.children.length; i++) {
    _getGlobalBounds(target.children[i], bounds, worldTransform, skipUpdateTransform);
  }
  if (preserveBounds) {
    for (let i = 0; i < target.effects.length; i++) {
      target.effects[i].addBounds?.(bounds);
    }
    parentBounds.addBounds(bounds);
  }
}
function updateTransformBackwards(target, parentTransform) {
  const parent = target.parent;
  if (parent) {
    updateTransformBackwards(parent, parentTransform);
    if (parent.didChange) {
      updateLocalTransform.updateLocalTransform(parent.localTransform, parent);
    }
    parentTransform.append(parent.localTransform);
  }
  return parentTransform;
}

exports._getGlobalBounds = _getGlobalBounds;
exports.getGlobalBounds = getGlobalBounds;
exports.updateTransformBackwards = updateTransformBackwards;
//# sourceMappingURL=getGlobalBounds.js.map
