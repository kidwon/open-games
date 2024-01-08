import { ObservablePoint } from '../maths/ObservablePoint.mjs';
import { Texture } from '../rendering/renderers/shared/texture/Texture.mjs';
import { emptyViewObserver } from '../rendering/renderers/shared/View.mjs';
import { NOOP } from '../utils/NOOP.mjs';
import { Transform } from '../utils/Transform.mjs';

let uid = 0;
const _TilingSpriteView = class {
  constructor(options) {
    this.batched = true;
    this.owner = emptyViewObserver;
    this.uid = uid++;
    this.type = "tilingSprite";
    this.onRenderableUpdate = NOOP;
    this._bounds = [0, 1, 0, 0];
    this.boundsDirty = true;
    options = { ..._TilingSpriteView.defaultOptions, ...options };
    this.anchor = new ObservablePoint(this, 0, 0);
    this.applyAnchorToTexture = options.applyAnchorToTexture;
    this.texture = options.texture;
    this._width = options.width;
    this._height = options.height;
    this.tileTransform = new Transform({ observer: this });
  }
  get bounds() {
    if (this.boundsDirty) {
      this.updateBounds();
      this.boundsDirty = false;
    }
    return this._bounds;
  }
  updateBounds() {
    const bounds = this._bounds;
    const anchor = this.anchor;
    const width = this._width;
    const height = this._height;
    bounds[1] = -anchor._x * width;
    bounds[0] = bounds[1] + width;
    bounds[3] = -anchor._y * height;
    bounds[2] = bounds[3] + height;
  }
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(
      _bounds[0],
      _bounds[2],
      _bounds[1],
      _bounds[3]
    );
  }
  set texture(value) {
    if (this._texture === value)
      return;
    this._texture = value;
    this.onUpdate();
  }
  get texture() {
    return this._texture;
  }
  set width(value) {
    this._width = value;
    this.onUpdate();
  }
  get width() {
    return this._width;
  }
  set height(value) {
    this._height = value;
    this.onUpdate();
  }
  get height() {
    return this._height;
  }
  /**
   * @internal
   */
  onUpdate() {
    this.boundsDirty = true;
    this.didUpdate = true;
    this.owner.onViewUpdate();
  }
  containsPoint(point) {
    const width = this.bounds[2];
    const height = this.bounds[3];
    const x1 = -width * this.anchor.x;
    let y1 = 0;
    if (point.x >= x1 && point.x < x1 + width) {
      y1 = -height * this.anchor.y;
      if (point.y >= y1 && point.y < y1 + height)
        return true;
    }
    return false;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options = false) {
    this.onRenderableUpdate = NOOP;
    this.anchor = null;
    this.tileTransform = null;
    this._bounds = null;
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
  }
};
let TilingSpriteView = _TilingSpriteView;
TilingSpriteView.defaultOptions = {
  texture: Texture.WHITE,
  width: 256,
  height: 256,
  applyAnchorToTexture: false
};

export { TilingSpriteView };
//# sourceMappingURL=TilingSpriteView.mjs.map
