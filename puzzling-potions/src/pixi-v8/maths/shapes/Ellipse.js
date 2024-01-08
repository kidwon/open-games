'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Rectangle = require('./Rectangle.js');

class Ellipse {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(x = 0, y = 0, halfWidth = 0, halfHeight = 0) {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'ellipse'
     */
    this.type = "ellipse";
    this.x = x;
    this.y = y;
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {PIXI.Ellipse} A copy of the ellipse
   */
  clone() {
    return new Ellipse(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   */
  contains(x, y) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0) {
      return false;
    }
    let normx = (x - this.x) / this.halfWidth;
    let normy = (y - this.y) / this.halfHeight;
    normx *= normx;
    normy *= normy;
    return normx + normy <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @returns The framing rectangle
   */
  getBounds() {
    return new Rectangle.Rectangle(this.x - this.halfWidth, this.y - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
  }
  /**
   * Copies another ellipse to this one.
   * @param ellipse - The ellipse to copy from.
   * @returns Returns itself.
   */
  copyFrom(ellipse) {
    this.x = ellipse.x;
    this.y = ellipse.y;
    this.halfWidth = ellipse.halfWidth;
    this.halfHeight = ellipse.halfHeight;
    return this;
  }
  /**
   * Copies this ellipse to another one.
   * @param ellipse - The ellipse to copy to.
   * @returns Returns given parameter.
   */
  copyTo(ellipse) {
    ellipse.copyFrom(this);
    return ellipse;
  }
  toString() {
    return `[@pixi/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}

exports.Ellipse = Ellipse;
//# sourceMappingURL=Ellipse.js.map
