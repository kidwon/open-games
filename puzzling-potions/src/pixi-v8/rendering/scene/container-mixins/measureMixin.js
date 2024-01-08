'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../maths/Matrix.js');
var Bounds = require('../bounds/Bounds.js');
var getGlobalBounds = require('../bounds/getGlobalBounds.js');
var getLocalBounds = require('../bounds/getLocalBounds.js');

const tempBounds = new Bounds.Bounds();
const tempMatrix = new Matrix.Matrix();
const measureMixin = {
  get width() {
    return this.scale.x * getLocalBounds.getLocalBounds(this, tempBounds, tempMatrix).width;
  },
  set width(value) {
    this.scale.x = value / getLocalBounds.getLocalBounds(this, tempBounds, tempMatrix).width;
  },
  get height() {
    return this.scale.y * getLocalBounds.getLocalBounds(this, tempBounds, tempMatrix).height;
  },
  set height(value) {
    this.scale.y = value / getLocalBounds.getLocalBounds(this, tempBounds, tempMatrix).height;
  },
  /**
   * Retrieves the local bounds of the displayObject as a Bounds object.
   * @returns - The bounding area.
   */
  getLocalBounds() {
    return getLocalBounds.getLocalBounds(this, tempBounds, this.localTransform).rectangle;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link PIXI.Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   */
  getBounds(skipUpdate) {
    return getGlobalBounds.getGlobalBounds(this, skipUpdate, tempBounds).rectangle;
  }
};

exports.measureMixin = measureMixin;
//# sourceMappingURL=measureMixin.js.map
