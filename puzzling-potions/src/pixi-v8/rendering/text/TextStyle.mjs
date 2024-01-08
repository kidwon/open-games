import EventEmitter from 'eventemitter3';
import { GraphicsContext } from '../graphics/shared/GraphicsContext.mjs';
import { convertFillInputToFillStyle } from '../graphics/shared/utils/convertFillInputToFillStyle.mjs';

const valuesToIterateForKeys = [
  "_fontFamily",
  "_fontStyle",
  "_fontVariant",
  "_fontWeight",
  "_breakWords",
  "_align",
  "_leading",
  "_letterSpacing",
  "_lineHeight",
  "_textBaseline",
  "_whiteSpace",
  "_wordWrap",
  "_wordWrapWidth",
  "_padding"
];
const _TextStyle = class extends EventEmitter {
  constructor(style = {}) {
    super();
    const fullStyle = { ..._TextStyle.defaultTextStyle, ...style };
    for (const key in _TextStyle.defaultTextStyle) {
      const thisKey = key;
      this[thisKey] = fullStyle[key];
    }
    this.dropShadow = null;
    if (typeof fullStyle.fill === "string") {
      this.fontSize = parseInt(fullStyle.fontSize, 10);
    } else {
      this.fontSize = fullStyle.fontSize;
    }
    if (style.dropShadow) {
      if (style.dropShadow instanceof Boolean) {
        if (style.dropShadow === true) {
          this.dropShadow = {
            ..._TextStyle.defaultTextStyle.dropShadow
          };
        }
      } else {
        this.dropShadow = {
          ..._TextStyle.defaultTextStyle.dropShadow,
          ...style.dropShadow
        };
      }
    }
    this.update();
  }
  get align() {
    return this._align;
  }
  set align(value) {
    this._align = value;
    this.update();
  }
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(value) {
    this._breakWords = value;
    this.update();
  }
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(value) {
    this._dropShadow = value;
    this.update();
  }
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(value) {
    this._fontFamily = value;
    this.update();
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(value) {
    this._fontSize = value;
    this.update();
  }
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(value) {
    this._fontStyle = value;
    this.update();
  }
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(value) {
    this._fontVariant = value;
    this.update();
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(value) {
    this._fontWeight = value;
    this.update();
  }
  get leading() {
    return this._leading;
  }
  set leading(value) {
    this._leading = value;
    this.update();
  }
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value) {
    this._letterSpacing = value;
    this.update();
  }
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(value) {
    this._lineHeight = value;
    this.update();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
    this.update();
  }
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(value) {
    this._textBaseline = value;
    this.update();
  }
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(value) {
    this._whiteSpace = value;
    this.update();
  }
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(value) {
    this._wordWrap = value;
    this.update();
  }
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(value) {
    this._wordWrapWidth = value;
    this.update();
  }
  get fill() {
    return this._originalFill;
  }
  set fill(value) {
    if (value === this._originalFill)
      return;
    this._originalFill = value;
    this._fill = convertFillInputToFillStyle(value, GraphicsContext.defaultFillStyle);
    this.update();
  }
  get stroke() {
    return this._originalStroke;
  }
  set stroke(value) {
    if (value === this._originalFill)
      return;
    this._originalFill = value;
    this._stroke = convertFillInputToFillStyle(value, GraphicsContext.defaultStrokeStyle);
    this.update();
  }
  generateKey() {
    const key = [];
    let index = 0;
    for (let i = 0; i < valuesToIterateForKeys.length; i++) {
      const prop = valuesToIterateForKeys[i];
      key[index++] = this[prop];
    }
    index = addFillStyleKey(this._fill, key, index);
    index = addStokeStyleKey(this._stroke, key, index);
    this._styleKey = key.join("-");
    return this._styleKey;
  }
  update() {
    this._styleKey = null;
    this.emit("update", this);
  }
  get styleKey() {
    return this._styleKey || this.generateKey();
  }
  clone() {
    return new _TextStyle({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this.dropShadow,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth
    });
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
   */
  destroy(options = false) {
    this.removeAllListeners();
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      if (this._fill?.texture) {
        this._fill.texture.destroy(destroyTextureSource);
      }
      if (this._originalFill?.texture) {
        this._originalFill.texture.destroy(destroyTextureSource);
      }
      if (this._stroke?.texture) {
        this._stroke.texture.destroy(destroyTextureSource);
      }
      if (this._originalStroke?.texture) {
        this._originalStroke.texture.destroy(destroyTextureSource);
      }
    }
    this._fill = null;
    this._stroke = null;
    this.dropShadow = null;
    this._originalStroke = null;
    this._originalFill = null;
  }
};
let TextStyle = _TextStyle;
TextStyle.defaultTextStyle = {
  /**
   * See {@link PIXI.TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link PIXI.TextStyle.breakWords} */
  breakWords: false,
  /** See {@link PIXI.TextStyle.dropShadow} */
  dropShadow: {
    alpha: 1,
    angle: Math.PI / 6,
    blur: 0,
    color: "black",
    distance: 5
  },
  /**
   * See {@link PIXI.TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link PIXI.TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link PIXI.TextStyle.fontSize}
   * @type {number|string}
   */
  fontSize: 26,
  /**
   * See {@link PIXI.TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link PIXI.TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link PIXI.TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link PIXI.TextStyle.leading} */
  leading: 0,
  /** See {@link PIXI.TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link PIXI.TextStyle.lineHeight} */
  lineHeight: 0,
  /** See {@link PIXI.TextStyle.padding} */
  padding: 0,
  /**
   * See {@link PIXI.TextStyle.stroke}
   * @type {string|number}
   */
  stroke: null,
  /**
   * See {@link PIXI.TextStyle.textBaseline}
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link PIXI.TextStyle.trim} */
  trim: false,
  /**
   * See {@link PIXI.TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link PIXI.TextStyle.wordWrap} */
  wordWrap: false,
  /** See {@link PIXI.TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
function addFillStyleKey(fillStyle, key, index) {
  if (!fillStyle)
    return index;
  key[index++] = fillStyle.color;
  key[index++] = fillStyle.alpha;
  key[index++] = fillStyle.fill?.uid;
  return index;
}
function addStokeStyleKey(strokeStyle, key, index) {
  if (!strokeStyle)
    return index;
  index = addFillStyleKey(strokeStyle, key, index);
  key[index++] = strokeStyle.width;
  key[index++] = strokeStyle.alignment;
  key[index++] = strokeStyle.cap;
  key[index++] = strokeStyle.join;
  key[index++] = strokeStyle.miterLimit;
  return index;
}

export { TextStyle };
//# sourceMappingURL=TextStyle.mjs.map
