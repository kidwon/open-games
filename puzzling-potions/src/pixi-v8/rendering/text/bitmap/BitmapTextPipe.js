'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Cache = require('../../../assets/cache/Cache.js');
var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var GraphicsView = require('../../graphics/shared/GraphicsView.js');
var ProxyRenderable = require('../../renderers/shared/ProxyRenderable.js');
var SdfShader = require('../sdfShader/SdfShader.js');
var BitmapFontManager = require('./BitmapFontManager.js');
var getBitmapTextLayout = require('./utils/getBitmapTextLayout.js');

class GraphicsProxyRenderable extends ProxyRenderable.ProxyRenderable {
  constructor() {
    super({
      view: new GraphicsView.GraphicsView()
    });
  }
}
class BitmapTextPipe {
  constructor(renderer) {
    this.gpuBitmapText = {};
    this.renderer = renderer;
  }
  validateRenderable(renderable) {
    const graphicsRenderable = this.getGpuBitmapText(renderable);
    this.updateContext(renderable, graphicsRenderable.view.context);
    const rebuild = this.renderer.renderPipes.graphics.validateRenderable(graphicsRenderable);
    return rebuild;
  }
  addRenderable(renderable, instructionSet) {
    const graphicsRenderable = this.getGpuBitmapText(renderable);
    this.renderer.renderPipes.batch.break(instructionSet);
    this.renderer.renderPipes.graphics.addRenderable(graphicsRenderable, instructionSet);
    if (graphicsRenderable.view.context.customShader) {
      this.updateDistanceField(renderable);
    }
  }
  destroyRenderable(renderable) {
    this.destroyRenderableByUid(renderable.uid);
  }
  destroyRenderableByUid(renderableUid) {
    PoolGroup.BigPool.return(this.gpuBitmapText[renderableUid]);
    this.gpuBitmapText[renderableUid] = null;
  }
  updateRenderable(renderable) {
    const graphicsRenderable = this.getGpuBitmapText(renderable);
    this.renderer.renderPipes.graphics.updateRenderable(graphicsRenderable);
    if (graphicsRenderable.view.context.customShader) {
      this.updateDistanceField(renderable);
    }
  }
  updateContext(renderable, context) {
    const view = renderable.view;
    const bitmapFont = BitmapFontManager.BitmapFontManager.getFont(view.text, view._style);
    context.clear();
    if (bitmapFont.distanceField.fieldType !== "none") {
      if (!context.customShader) {
        if (!this.sdfShader) {
          this.sdfShader = new SdfShader.SdfShader();
        }
        context.customShader = this.sdfShader;
      }
    }
    const chars = Array.from(view.text);
    const style = view._style;
    let currentY = (style._stroke?.width || 0) / 2;
    currentY += bitmapFont.baseLineOffset;
    const bitmapTextLayout = getBitmapTextLayout.getBitmapTextLayout(chars, style, bitmapFont);
    let index = 0;
    const scale = style.fontSize / bitmapFont.baseMeasurementFontSize;
    context.scale(scale, scale);
    const offsetX = -view.anchor.x * bitmapTextLayout.width;
    const offsetY = -view.anchor.y * bitmapTextLayout.height;
    context.translate(offsetX, offsetY);
    const tint = style._fill.color;
    for (let i = 0; i < bitmapTextLayout.lines.length; i++) {
      const line = bitmapTextLayout.lines[i];
      for (let j = 0; j < line.charPositions.length; j++) {
        const char = chars[index++];
        const charData = bitmapFont.chars[char];
        if (charData?.texture) {
          context.texture(
            charData.texture,
            tint,
            Math.round(line.charPositions[j] + charData.xOffset),
            Math.round(currentY + charData.yOffset)
          );
        }
      }
      currentY += bitmapFont.lineHeight;
    }
  }
  getGpuBitmapText(renderable) {
    return this.gpuBitmapText[renderable.uid] || this.initGpuText(renderable);
  }
  initGpuText(renderable) {
    renderable.view._style.update();
    const proxyRenderable = PoolGroup.BigPool.get(GraphicsProxyRenderable, renderable);
    this.gpuBitmapText[renderable.uid] = proxyRenderable;
    this.updateContext(renderable, proxyRenderable.view.context);
    renderable.on("destroyed", () => {
      this.destroyRenderable(renderable);
    });
    return this.gpuBitmapText[renderable.uid];
  }
  updateDistanceField(renderable) {
    const context = this.getGpuBitmapText(renderable).view.context;
    const view = renderable.view;
    const fontFamily = view._style.fontFamily;
    const dynamicFont = Cache.Cache.get(fontFamily);
    const { a, b, c, d } = renderable.layerTransform;
    const dx = Math.sqrt(a * a + b * b);
    const dy = Math.sqrt(c * c + d * d);
    const worldScale = (Math.abs(dx) + Math.abs(dy)) / 2;
    const fontScale = dynamicFont.baseRenderedFontSize / view._style.fontSize;
    const resolution = 1;
    const distance = worldScale * dynamicFont.distanceField.distanceRange * (1 / fontScale) * resolution;
    context.customShader.resources.localUniforms.uniforms.distance = distance;
  }
  destroy() {
    for (const uid in this.gpuBitmapText) {
      this.destroyRenderableByUid(uid);
    }
    this.gpuBitmapText = null;
    this.sdfShader?.destroy(true);
    this.sdfShader = null;
    this.renderer = null;
  }
}
/** @ignore */
BitmapTextPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "bitmapText"
};

exports.BitmapTextPipe = BitmapTextPipe;
//# sourceMappingURL=BitmapTextPipe.js.map
