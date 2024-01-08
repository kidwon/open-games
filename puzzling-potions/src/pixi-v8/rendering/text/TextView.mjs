import { Cache } from '../../assets/cache/Cache.mjs';
import { ObservablePoint } from '../../maths/ObservablePoint.mjs';
import { emptyViewObserver } from '../renderers/shared/View.mjs';
import { BitmapFontManager } from './bitmap/BitmapFontManager.mjs';
import { CanvasTextMetrics } from './canvas/CanvasTextMetrics.mjs';
import { TextStyle } from './TextStyle.mjs';

let uid = 0;
const map = {
  canvas: "text",
  html: "text",
  bitmap: "bitmapText"
};
const _TextView = class {
  constructor(options) {
    this.uid = uid++;
    this.batched = true;
    this.type = "text";
    this.owner = emptyViewObserver;
    this._bounds = [0, 1, 0, 0];
    this.boundsDirty = true;
    this._autoResolution = _TextView.defaultAutoResolution;
    this._resolution = _TextView.defaultResolution;
    this.didUpdate = true;
    this.text = options.text ?? "";
    this._style = options.style instanceof TextStyle ? options.style : new TextStyle(options.style);
    const renderMode = options.renderMode ?? this.detectRenderType(this._style);
    this.type = map[renderMode];
    this.anchor = new ObservablePoint(this, 0, 0);
    this._resolution = options.resolution ?? _TextView.defaultResolution;
  }
  set text(value) {
    value = value.toString();
    if (this._text === value)
      return;
    this._text = value;
    this.onUpdate();
  }
  get text() {
    return this._text;
  }
  get style() {
    return this._style;
  }
  set style(style) {
    style = style || {};
    this._style?.off("update", this.onUpdate, this);
    if (style instanceof TextStyle) {
      this._style = style;
    } else {
      this._style = new TextStyle(style);
    }
    this._style.on("update", this.onUpdate, this);
    this.onUpdate();
  }
  set resolution(value) {
    this._resolution = value;
  }
  get resolution() {
    return this._resolution;
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
    if (this.type === "bitmapText") {
      const bitmapMeasurement = BitmapFontManager.measureText(this.text, this._style);
      const scale = bitmapMeasurement.scale;
      const offset = bitmapMeasurement.offsetY * scale;
      bounds[0] = 0;
      bounds[1] = offset;
      bounds[2] = bitmapMeasurement.width * scale;
      bounds[3] = bitmapMeasurement.height * scale + offset;
    } else {
      const canvasMeasurement = CanvasTextMetrics.measureText(this.text, this._style);
      bounds[0] = 0;
      bounds[1] = 0;
      bounds[2] = canvasMeasurement.width;
      bounds[3] = canvasMeasurement.height;
    }
  }
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(
      _bounds[0],
      _bounds[1],
      _bounds[2],
      _bounds[3]
    );
  }
  /**
   * @internal
   */
  onUpdate() {
    this.didUpdate = true;
    this.boundsDirty = true;
    this.owner.onViewUpdate();
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}`;
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
  detectRenderType(style) {
    return Cache.has(style.fontFamily) ? "bitmap" : "canvas";
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   */
  destroy(options = false) {
    this.owner = null;
    this._bounds = null;
    this.anchor = null;
    this._style.destroy(options);
    this._style = null;
    this._text = null;
  }
};
let TextView = _TextView;
TextView.defaultResolution = 1;
TextView.defaultAutoResolution = true;

export { TextView };
//# sourceMappingURL=TextView.mjs.map
