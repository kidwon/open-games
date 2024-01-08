import EventEmitter from 'eventemitter3';
import { Rectangle } from '../../../maths/shapes/Rectangle.mjs';
import { convertColorToNumber } from '../../../utils/color/convertColorToNumber.mjs';
import { hex2rgb } from '../../../utils/color/hex.mjs';
import { CanvasPool } from '../../renderers/shared/texture/CanvasPool.mjs';
import { ALPHA_MODES } from '../../renderers/shared/texture/const.mjs';
import { ImageSource } from '../../renderers/shared/texture/sources/ImageSource.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { CanvasTextMetrics } from '../canvas/CanvasTextMetrics.mjs';
import { fontStringFromTextStyle } from '../canvas/utils/fontStringFromTextStyle.mjs';
import { getCanvasFillStyle } from '../canvas/utils/getCanvasFillStyle.mjs';
import { TextStyle } from '../TextStyle.mjs';
import { resolveCharacters } from './utils/resolveCharacters.mjs';

class DynamicBitmapFont extends EventEmitter {
  constructor(options) {
    super();
    this.baseRenderedFontSize = 100;
    this.baseMeasurementFontSize = 100;
    this.padding = 4;
    this.baseLineOffset = 0;
    this.pages = [];
    this.chars = {};
    this.lineHeight = 0;
    this.measureCache = {};
    this.currentChars = [];
    this.dynamic = true;
    this.currentX = 0;
    this.currentY = 0;
    this.currentPageIndex = -1;
    // this is a resolution modifier for the font size..
    // texture resolution will also be used to scale texture according to its font size also
    this.resolution = 1;
    this.distanceField = {
      fieldType: "none",
      distanceRange: 0
    };
    this.pages = [];
    const dynamicOptions = options;
    this.dynamic = true;
    let style;
    if (dynamicOptions.style instanceof TextStyle) {
      style = dynamicOptions.style.clone();
    } else {
      style = new TextStyle(dynamicOptions.style);
    }
    style.fontSize = this.baseMeasurementFontSize;
    if (dynamicOptions.overrideFill) {
      style._fill.color = 16777215;
      style._fill.alpha = 1;
      style._fill.texture = Texture.WHITE;
      style._fill.fill = null;
    }
    this.style = style;
    const font = fontStringFromTextStyle(style);
    this.fontMetrics = CanvasTextMetrics.measureFont(font);
    this.lineHeight = style.lineHeight || this.fontMetrics.fontSize || style.fontSize;
  }
  ensureCharacters(chars) {
    const charList = resolveCharacters(chars).filter((char) => !this.currentChars.includes(char)).filter((char, index, self) => self.indexOf(char) === index);
    if (!charList.length)
      return;
    this.currentChars = [...this.currentChars, ...charList];
    let pageData;
    if (this.currentPageIndex === -1) {
      pageData = this.nextPage();
    } else {
      pageData = this.pages[this.currentPageIndex];
    }
    let { canvas, context } = pageData.canvasAndContext;
    let textureSource = pageData.texture.source;
    const style = this.style;
    let currentX = this.currentX;
    let currentY = this.currentY;
    const fontScale = this.baseRenderedFontSize / this.baseMeasurementFontSize;
    const padding = this.padding * fontScale;
    const widthScale = style.fontStyle === "italic" ? 2 : 1;
    let maxCharHeight = 0;
    let skipTexture = false;
    for (let i = 0; i < charList.length; i++) {
      const char = charList[i];
      const metrics = CanvasTextMetrics.measureText(char, style, canvas, false);
      const width = widthScale * metrics.width * fontScale;
      const height = metrics.height * fontScale;
      const paddedWidth = width + padding * 2;
      const paddedHeight = height + padding * 2;
      skipTexture = false;
      if (char !== "\n" && char !== "\r" && char !== "	" && char !== " ") {
        skipTexture = true;
        maxCharHeight = Math.ceil(Math.max(paddedHeight, maxCharHeight));
      }
      if (currentX + paddedWidth > 512) {
        currentY += maxCharHeight;
        maxCharHeight = paddedHeight;
        currentX = 0;
        if (currentY + maxCharHeight > 512) {
          textureSource.update();
          const pageData2 = this.nextPage();
          canvas = pageData2.canvasAndContext.canvas;
          context = pageData2.canvasAndContext.context;
          textureSource = pageData2.texture.source;
          currentY = 0;
        }
      }
      const xAdvance = width / fontScale - (style.dropShadow?.distance ?? 0) - (style._stroke?.width ?? 0);
      this.chars[char] = {
        id: char.codePointAt(0),
        xOffset: -this.padding,
        yOffset: -this.padding,
        xAdvance,
        kerning: {}
      };
      if (skipTexture) {
        this.drawGlyph(
          context,
          metrics,
          currentX + padding,
          currentY + padding,
          fontScale,
          style
        );
        const px = textureSource.width * fontScale;
        const py = textureSource.height * fontScale;
        const frame = new Rectangle(
          currentX / px,
          currentY / py,
          paddedWidth / px,
          paddedHeight / py
        );
        this.chars[char].texture = new Texture({
          source: textureSource,
          layout: {
            frame
          }
        });
        currentX += Math.ceil(paddedWidth);
      }
    }
    textureSource.update();
    this.currentX = currentX;
    this.currentY = currentY;
    this.applyKerning(charList, context);
  }
  applyKerning(newChars, context) {
    const measureCache = this.measureCache;
    for (let i = 0; i < newChars.length; i++) {
      const first = newChars[i];
      for (let j = 0; j < this.currentChars.length; j++) {
        const second = this.currentChars[j];
        let c1 = measureCache[first];
        if (!c1)
          c1 = measureCache[first] = context.measureText(first).width;
        let c2 = measureCache[second];
        if (!c2)
          c2 = measureCache[second] = context.measureText(second).width;
        let total = context.measureText(first + second).width;
        let amount = total - (c1 + c2);
        if (amount) {
          this.chars[first].kerning[second] = amount;
        }
        total = context.measureText(first + second).width;
        amount = total - (c1 + c2);
        if (amount) {
          this.chars[second].kerning[first] = amount;
        }
      }
    }
  }
  nextPage() {
    this.currentPageIndex++;
    const textureResolution = this.resolution;
    const canvasAndContext = CanvasPool.getOptimalCanvasAndContext(512, 512, textureResolution);
    this.setupContext(canvasAndContext.context, this.style, textureResolution);
    const resolution = textureResolution * (this.baseRenderedFontSize / this.baseMeasurementFontSize);
    const texture = new Texture({
      source: new ImageSource({
        resource: canvasAndContext.canvas,
        resolution,
        alphaMode: ALPHA_MODES.PMA
      })
    });
    const pageData = {
      canvasAndContext,
      texture
    };
    this.pages[this.currentPageIndex] = pageData;
    return pageData;
  }
  // canvas style!
  setupContext(context, style, resolution) {
    style.fontSize = this.baseRenderedFontSize;
    context.scale(resolution, resolution);
    context.font = fontStringFromTextStyle(style);
    style.fontSize = this.baseMeasurementFontSize;
    context.textBaseline = style.textBaseline;
    const stroke = style._stroke;
    const strokeThickness = stroke?.width ?? 0;
    if (stroke) {
      context.lineWidth = strokeThickness;
      context.lineJoin = stroke.join;
      context.miterLimit = stroke.miterLimit;
      context.strokeStyle = getCanvasFillStyle(stroke, context);
    }
    if (style._fill) {
      context.fillStyle = getCanvasFillStyle(style._fill, context);
    }
    if (style.dropShadow) {
      const shadowOptions = style.dropShadow;
      const dropShadowColor = convertColorToNumber(shadowOptions.color);
      const rgb = hex2rgb(dropShadowColor);
      const dropShadowBlur = shadowOptions.blur * resolution;
      const dropShadowDistance = shadowOptions.distance * resolution;
      context.shadowColor = `rgba(${rgb[0] * 255},${rgb[1] * 255},${rgb[2] * 255},${shadowOptions.alpha})`;
      context.shadowBlur = dropShadowBlur;
      context.shadowOffsetX = Math.cos(shadowOptions.angle) * dropShadowDistance;
      context.shadowOffsetY = Math.sin(shadowOptions.angle) * dropShadowDistance;
    } else {
      context.shadowColor = "black";
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
    }
  }
  drawGlyph(context, metrics, x, y, fontScale, style) {
    const char = metrics.text;
    const fontProperties = metrics.fontProperties;
    const stroke = style._stroke;
    const strokeThickness = (stroke?.width ?? 0) * fontScale;
    const tx = x + strokeThickness / 2;
    const ty = y - strokeThickness / 2;
    const descent = fontProperties.descent * fontScale;
    const lineHeight = metrics.lineHeight * fontScale;
    if (style.stroke && strokeThickness) {
      context.strokeText(char, tx, ty + lineHeight - descent);
    }
    if (style._fill) {
      context.fillText(char, tx, ty + lineHeight - descent);
    }
  }
  destroy() {
    this.emit("destroy", this);
    this.removeAllListeners();
    for (const i in this.chars) {
      this.chars[i].texture.destroy();
    }
    this.chars = null;
    for (let i = 0; i < this.pages.length; i++) {
      const { canvasAndContext, texture } = this.pages[i];
      CanvasPool.returnCanvasAndContext(canvasAndContext);
      texture.destroy(true);
    }
    this.pages = null;
  }
}

export { DynamicBitmapFont };
//# sourceMappingURL=DynamicBitmapFont.mjs.map
