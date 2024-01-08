import { LoaderParserPriority } from '../../../../assets/loader/parsers/LoaderParser.mjs';
import { copySearchParams } from '../../../../assets/utils/copySearchParams.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { settings } from '../../../../settings/settings.mjs';
import { path } from '../../../../utils/path.mjs';
import { BitmapFont } from '../BitmapFont.mjs';
import { TextFormat } from './textFormat.mjs';
import { XMLStringFormat } from './xmlStringFormat.mjs';

const validExtensions = [".xml", ".fnt"];
const bitmapFontCachePlugin = {
  extension: ExtensionType.CacheParser,
  test: (asset) => asset instanceof BitmapFont,
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
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Normal
  },
  test(url) {
    return validExtensions.includes(path.extname(url).toLowerCase());
  },
  async testParse(data) {
    return TextFormat.test(data) || XMLStringFormat.test(data);
  },
  async parse(asset, data, loader) {
    const bitmapFontData = TextFormat.test(asset) ? TextFormat.parse(asset) : XMLStringFormat.parse(asset);
    const { src } = data;
    const { pages } = bitmapFontData;
    const textureUrls = [];
    for (let i = 0; i < pages.length; ++i) {
      const pageFile = pages[i].file;
      let imagePath = path.join(path.dirname(src), pageFile);
      imagePath = copySearchParams(imagePath, src);
      textureUrls.push(imagePath);
    }
    const loadedTextures = await loader.load(textureUrls);
    const textures = textureUrls.map((url) => loadedTextures[url]);
    const bitmapFont = new BitmapFont({
      data: bitmapFontData,
      textures
    });
    return bitmapFont;
  },
  async load(url, _options) {
    const response = await settings.ADAPTER.fetch(url);
    return await response.text();
  },
  unload(bitmapFont) {
    bitmapFont.destroy();
  }
};

export { bitmapFontCachePlugin, xmlBitmapFontLoader };
//# sourceMappingURL=loadBitmapFont.mjs.map
