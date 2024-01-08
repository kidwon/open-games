import EventEmitter from 'eventemitter3';
import { Rectangle } from '../../../maths/shapes/Rectangle.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';

class BitmapFont extends EventEmitter {
  constructor(options) {
    super();
    this.baseRenderedFontSize = 100;
    this.baseMeasurementFontSize = 100;
    this.pages = [];
    this.chars = {};
    this.lineHeight = 0;
    this.baseLineOffset = 0;
    this.pages = [];
    const { textures, data } = options;
    Object.keys(data.pages).forEach((key) => {
      const pageData = data.pages[parseInt(key, 10)];
      const texture = textures[pageData.id];
      this.pages.push({ texture });
    });
    Object.keys(data.chars).forEach((key) => {
      const charData = data.chars[key];
      const textureSource = textures[charData.page].source;
      const frame = new Rectangle(
        charData.x / textureSource.width,
        charData.y / textureSource.height,
        charData.width / textureSource.width,
        charData.height / textureSource.height
      );
      const texture = new Texture({
        source: textureSource,
        layout: {
          frame
        }
      });
      this.chars[key] = {
        id: key.codePointAt(0),
        xOffset: charData.xOffset,
        yOffset: charData.yOffset,
        // - 31, // + 61 - 87,
        xAdvance: charData.xAdvance,
        kerning: charData.kerning ?? {},
        texture
      };
    });
    this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: data.fontSize
    };
    this.baseLineOffset = data.baseLineOffset;
    this.lineHeight = data.lineHeight;
    this.fontName = data.fontName;
    this.baseMeasurementFontSize = data.fontSize;
    this.baseRenderedFontSize = data.fontSize;
    this.distanceField = data.distanceField ?? {
      fieldType: "none",
      distanceRange: 0
    };
  }
  destroy() {
    this.emit("destroy", this);
    this.removeAllListeners();
    for (const i in this.chars) {
      this.chars[i].texture.destroy();
    }
    this.chars = null;
    for (let i = 0; i < this.pages.length; i++) {
      const { texture } = this.pages[i];
      texture.destroy(true);
    }
    this.pages = null;
  }
}

export { BitmapFont };
//# sourceMappingURL=BitmapFont.mjs.map
