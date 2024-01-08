import { Cache } from '../../../assets/cache/Cache.mjs';
import { DynamicBitmapFont } from './DynamicBitmapFont.mjs';
import { getBitmapTextLayout } from './utils/getBitmapTextLayout.mjs';

class BitmapFontManagerClass {
  getFont(text, style) {
    let fontFamilyKey = style.fontFamily;
    let overrideFill = true;
    if (style._fill.fill) {
      fontFamilyKey += style._fill.fill.uid;
      overrideFill = false;
    }
    if (!Cache.has(fontFamilyKey)) {
      Cache.set(fontFamilyKey, new DynamicBitmapFont({
        style,
        overrideFill
      }));
    }
    const dynamicFont = Cache.get(fontFamilyKey);
    dynamicFont.ensureCharacters?.(text);
    return dynamicFont;
  }
  getLayout(text, style) {
    const bitmapFont = this.getFont(text, style);
    return getBitmapTextLayout(text.split(""), style, bitmapFont);
  }
  measureText(text, style) {
    return this.getLayout(text, style);
  }
}
const BitmapFontManager = new BitmapFontManagerClass();

export { BitmapFontManager };
//# sourceMappingURL=BitmapFontManager.mjs.map
