'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Cache = require('../../../assets/cache/Cache.js');
var DynamicBitmapFont = require('./DynamicBitmapFont.js');
var getBitmapTextLayout = require('./utils/getBitmapTextLayout.js');

class BitmapFontManagerClass {
  getFont(text, style) {
    let fontFamilyKey = style.fontFamily;
    let overrideFill = true;
    if (style._fill.fill) {
      fontFamilyKey += style._fill.fill.uid;
      overrideFill = false;
    }
    if (!Cache.Cache.has(fontFamilyKey)) {
      Cache.Cache.set(fontFamilyKey, new DynamicBitmapFont.DynamicBitmapFont({
        style,
        overrideFill
      }));
    }
    const dynamicFont = Cache.Cache.get(fontFamilyKey);
    dynamicFont.ensureCharacters?.(text);
    return dynamicFont;
  }
  getLayout(text, style) {
    const bitmapFont = this.getFont(text, style);
    return getBitmapTextLayout.getBitmapTextLayout(text.split(""), style, bitmapFont);
  }
  measureText(text, style) {
    return this.getLayout(text, style);
  }
}
const BitmapFontManager = new BitmapFontManagerClass();

exports.BitmapFontManager = BitmapFontManager;
//# sourceMappingURL=BitmapFontManager.js.map
