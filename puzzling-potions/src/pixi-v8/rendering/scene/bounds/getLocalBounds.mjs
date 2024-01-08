import { Matrix } from '../../../maths/Matrix.mjs';
import { updateLocalTransform } from '../utils/updateLocalTransform.mjs';

function getLocalBounds(target, bounds, relativeMatrix) {
  bounds.clear();
  relativeMatrix || (relativeMatrix = new Matrix());
  if (target.view) {
    bounds.setMatrix(relativeMatrix);
    target.view.addBounds(bounds);
  }
  for (let i = 0; i < target.children.length; i++) {
    _getLocalBounds(target.children[i], bounds, relativeMatrix, target);
  }
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  return bounds;
}
function _getLocalBounds(target, bounds, parentTransform, rootContainer) {
  if (!target.visible || !target.measurable)
    return;
  if (target.didChange) {
    updateLocalTransform(target.localTransform, target);
  }
  const localTransform = target.localTransform;
  const relativeTransform = Matrix.shared.appendFrom(localTransform, parentTransform).clone();
  if (target.view) {
    bounds.setMatrix(relativeTransform);
    target.view.addBounds(bounds);
  }
  for (let i = 0; i < target.children.length; i++) {
    _getLocalBounds(target.children[i], bounds, relativeTransform, rootContainer);
  }
  for (let i = 0; i < target.effects.length; i++) {
    target.effects[i].addLocalBounds?.(bounds, rootContainer);
  }
}
function getParent(target, root, matrix) {
  const parent = target.parent;
  if (!parent) {
    console.warn("Item is not inside the root container");
    return;
  }
  if (parent !== root) {
    getParent(parent, root, matrix);
    updateLocalTransform(parent.localTransform, parent);
    matrix.append(parent.localTransform);
  }
}

export { getLocalBounds, getParent };
//# sourceMappingURL=getLocalBounds.mjs.map
