import { Matrix } from '../../../maths/Matrix.mjs';
import { Bounds } from '../bounds/Bounds.mjs';
import { getGlobalBounds } from '../bounds/getGlobalBounds.mjs';
import { getLocalBounds } from '../bounds/getLocalBounds.mjs';

const tempBounds = new Bounds();
const tempMatrix = new Matrix();
const measureMixin = {
  get width() {
    return this.scale.x * getLocalBounds(this, tempBounds, tempMatrix).width;
  },
  set width(value) {
    this.scale.x = value / getLocalBounds(this, tempBounds, tempMatrix).width;
  },
  get height() {
    return this.scale.y * getLocalBounds(this, tempBounds, tempMatrix).height;
  },
  set height(value) {
    this.scale.y = value / getLocalBounds(this, tempBounds, tempMatrix).height;
  },
  /**
   * Retrieves the local bounds of the displayObject as a Bounds object.
   * @returns - The bounding area.
   */
  getLocalBounds() {
    return getLocalBounds(this, tempBounds, this.localTransform).rectangle;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link PIXI.Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   */
  getBounds(skipUpdate) {
    return getGlobalBounds(this, skipUpdate, tempBounds).rectangle;
  }
};

export { measureMixin };
//# sourceMappingURL=measureMixin.mjs.map
