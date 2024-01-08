import EventEmitter from 'eventemitter3';
import { Cache } from '../../../../assets/cache/Cache.mjs';
import { NOOP } from '../../../../utils/NOOP.mjs';
import { TextureSource } from './sources/TextureSource.mjs';
import { TextureLayout } from './TextureLayout.mjs';
import { TextureMatrix } from './TextureMatrix.mjs';
import { TextureStyle } from './TextureStyle.mjs';

let UID = 0;
class Texture extends EventEmitter {
  constructor({ source, style, layout, label } = {}) {
    super();
    this.id = UID++;
    this.styleSourceKey = 0;
    this.label = label;
    this.source = source?.source ?? new TextureSource();
    this.layout = layout instanceof TextureLayout ? layout : new TextureLayout(layout);
    if (style) {
      this._style = style instanceof TextureStyle ? style : new TextureStyle(style);
    }
    this.styleSourceKey = (this.style.resourceId << 24) + this._source.uid;
  }
  static from(id) {
    if (typeof id === "string") {
      return Cache.get(id);
    }
    return new Texture({ source: id });
  }
  set source(value) {
    if (this._source) {
      this._source.off("update", this.onStyleSourceUpdate, this);
      this._source.off("resize", this.onUpdate, this);
    }
    this._source = value;
    value.on("update", this.onStyleSourceUpdate, this);
    value.on("resize", this.onUpdate, this);
    this.styleSourceKey = (this.style.resourceId << 24) + this._source.uid;
    this.emit("update", this);
  }
  get source() {
    return this._source;
  }
  get style() {
    return this._style || this.source.style;
  }
  set style(value) {
    this._style?.off("change", this.onStyleSourceUpdate, this);
    this._style = value;
    this._style?.on("change", this.onStyleSourceUpdate, this);
  }
  get layout() {
    return this._layout;
  }
  set layout(value) {
    this._layout?.off("update", this.onUpdate, this);
    this._layout = value;
    value.on("update", this.onUpdate, this);
    this.emit("update", this);
  }
  get textureMatrix() {
    if (!this._textureMatrix) {
      this._textureMatrix = new TextureMatrix(this);
    }
    return this._textureMatrix;
  }
  set frameWidth(value) {
    this._layout.frame.width = value / this._source.width;
  }
  get frameWidth() {
    return this._source.pixelWidth / this._source._resolution * this._layout.frame.width;
  }
  set frameHeight(value) {
    this._layout.frame.height = value / this._source.height;
  }
  get frameHeight() {
    return this._source.pixelHeight / this._source._resolution * this._layout.frame.height;
  }
  set frameX(value) {
    if (value === 0) {
      this._layout.frame.x = 0;
      return;
    }
    this._layout.frame.x = this._source.width / value;
  }
  get frameX() {
    return this._source.width * this._layout.frame.x;
  }
  set frameY(value) {
    if (value === 0) {
      this._layout.frame.y = 0;
      return;
    }
    this._layout.frame.y = this._source.height / value;
  }
  get frameY() {
    return this._source.height * this._layout.frame.y;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this._source.width * this._layout.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this._source.height * this._layout.orig.height;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(destroySource = false) {
    if (this._style) {
      this._style.destroy();
      this._style = null;
    }
    if (this._layout) {
      this._layout.destroy();
      this._layout = null;
    }
    if (this._source) {
      if (destroySource) {
        this._source.destroy();
        this._source = null;
      }
    }
    this._textureMatrix = null;
    this.removeAllListeners();
  }
  /**
   * @internal
   */
  onStyleSourceUpdate() {
    this.styleSourceKey = (this.style.resourceId << 24) + this._source.uid;
    this.emit("update", this);
  }
  /**
   * @internal
   */
  onUpdate() {
    this.emit("update", this);
  }
}
Texture.EMPTY = new Texture({});
Texture.EMPTY.label = "EMPTY";
Texture.EMPTY.destroy = NOOP;

export { Texture };
//# sourceMappingURL=Texture.mjs.map
