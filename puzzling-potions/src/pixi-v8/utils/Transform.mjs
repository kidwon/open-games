import { Matrix } from '../maths/Matrix.mjs';
import { ObservablePoint } from '../maths/ObservablePoint.mjs';

class Transform {
  constructor({ matrix, observer } = {}) {
    this.dirty = true;
    this._matrix = matrix ?? new Matrix();
    this.observer = observer;
    this.position = new ObservablePoint(this, 0, 0);
    this.scale = new ObservablePoint(this, 1, 1);
    this.pivot = new ObservablePoint(this, 0, 0);
    this.skew = new ObservablePoint(this, 0, 0);
    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
  }
  get matrix() {
    const lt = this._matrix;
    if (!this.dirty)
      return lt;
    lt.a = this._cx * this.scale.x;
    lt.b = this._sx * this.scale.x;
    lt.c = this._cy * this.scale.y;
    lt.d = this._sy * this.scale.y;
    lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
    lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
    this.dirty = false;
    return lt;
  }
  /**
   * Called when a value changes.
   * @param point
   * @internal
   */
  onUpdate(point) {
    this.dirty = true;
    if (point === this.skew) {
      this.updateSkew();
    }
    this.observer?.onUpdate(this);
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x);
    this._sy = Math.cos(this._rotation - this.skew.x);
    this.dirty = true;
  }
  toString() {
    return `[@pixi/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @param matrix - The matrix to decompose
   */
  setFromMatrix(matrix) {
    matrix.decompose(this);
    this.dirty = true;
  }
  /** The rotation of the object in radians. */
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.updateSkew();
    }
  }
}

export { Transform };
//# sourceMappingURL=Transform.mjs.map
