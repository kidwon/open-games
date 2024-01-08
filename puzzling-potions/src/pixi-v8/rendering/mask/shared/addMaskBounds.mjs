import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { getGlobalBounds } from '../../scene/bounds/getGlobalBounds.mjs';

const tempBounds = new Bounds();
function addMaskBounds(mask, bounds, skipUpdateTransform) {
  const boundsToMask = tempBounds;
  mask.measurable = true;
  getGlobalBounds(mask, skipUpdateTransform, boundsToMask);
  bounds.addBoundsMask(boundsToMask);
  mask.measurable = false;
}

export { addMaskBounds, tempBounds };
//# sourceMappingURL=addMaskBounds.mjs.map
