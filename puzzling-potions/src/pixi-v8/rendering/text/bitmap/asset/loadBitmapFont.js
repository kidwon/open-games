'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LoaderParser = require('../../../../assets/loader/parsers/LoaderParser.js');
var copySearchParams = require('../../../../assets/utils/copySearchParams.js');
var Extensions = require('../../../../extensions/Extensions.js');
var settings = require('../../../../settings/settings.js');
var path = require('../../../../utils/path.js');
var BitmapFont = require('../BitmapFont.js');
var textFormat = require('./textFormat.js');
var xmlStringFormat = require('./xmlStringFormat.js');

const validExtensions = [".xml", ".fnt"];
const bitmapFontCachePlugin = {
  extension: Extensions.ExtensionType.CacheParser,
  test: (asset) => asset instanceof BitmapFont.BitmapFont,
  getCacheableAssets(keys, asset) {
    const out = {};
    keys.forEach((key) => {
      out[key] = asset;
    });
    out[asset.fontName] = asset;
    return out;
  }
};
const xmlBitmapFontLoader = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Normal
  },
  test(url) {
    return validExtensions.includes(path.path.extname(url).toLowerCase());
  },
  async testParse(data) {
    return textFormat.TextFormat.test(data) || xmlStringFormat.XMLStringFormat.test(data);
  },
  async parse(asset, data, loader) {
    const bitmapFontData = textFormat.TextFormat.test(asset) ? textFormat.TextFormat.parse(asset) : xmlStringFormat.XMLStringFormat.parse(asset);
    const { src } = data;
    const { pages } = bitmapFontData;
    const textureUrls = [];
    for (let i = 0; i < pages.length; ++i) {
      const pageFile = pages[i].file;
      let imagePath = path.path.join(path.path.dirname(src), pageFile);
      imagePath = copySearchParams.copySearchParams(imagePath, src);
      textureUrls.push(imagePath);
    }
    const loadedTextures = await loader.load(textureUrls);
    const textures = textureUrls.map((url) => loadedTextures[url]);
    const bitmapFont = new BitmapFont.BitmapFont({
      data: bitmapFontData,
      textures
    });
    return bitmapFont;
  },
  async load(url, _options) {
    const response = await settings.settings.ADAPTER.fetch(url);
    return await response.text();
  },
  unload(bitmapFont) {
    bitmapFont.destroy();
  }
};

exports.bitmapFontCachePlugin = bitmapFontCachePlugin;
exports.xmlBitmapFontLoader = xmlBitmapFontLoader;
//# sourceMappingURL=loadBitmapFont.js.map
