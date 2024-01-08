import { Matrix } from '../../../maths/Matrix.mjs';
import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { getLocalBounds } from '../../scene/bounds/getLocalBounds.mjs';
import { updateLocalTransform } from '../../scene/utils/updateLocalTransform.mjs';

function addMaskLocalBounds(mask, bounds, localRoot) {
  const boundsToMask = new Bounds();
  mask.measurable = true;
  const relativeMask = getMatrixRelativeToParent(mask, localRoot, new Matrix());
  getLocalBounds(mask, boundsToMask, relativeMask);
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
      updateLocalTransform(target.localTransform, target);
    }
    matrix.append(target.localTransform);
  }
  return matrix;
}

export { addMaskLocalBounds, getMatrixRelativeToParent };
//# sourceMappingURL=addMaskLocalBounds.mjs.map
