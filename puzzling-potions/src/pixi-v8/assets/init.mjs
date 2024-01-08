import { extensions, ExtensionType } from '../extensions/Extensions.mjs';
import { xmlBitmapFontLoader, bitmapFontCachePlugin } from '../rendering/text/bitmap/asset/loadBitmapFont.mjs';
import { cacheTextureArray } from './cache/parsers/cacheTextureArray.mjs';
import { detectAvif } from './detections/parsers/detectAvif.mjs';
import { detectDefaults } from './detections/parsers/detectDefaults.mjs';
import { detectMp4 } from './detections/parsers/detectMp4.mjs';
import { detectOgv } from './detections/parsers/detectOgv.mjs';
import { detectWebm } from './detections/parsers/detectWebm.mjs';
import { detectWebp } from './detections/parsers/detectWebp.mjs';
import { loadJson } from './loader/parsers/loadJson.mjs';
import { loadTxt } from './loader/parsers/loadTxt.mjs';
import { loadWebFont } from './loader/parsers/loadWebFont.mjs';
import { loadSvg } from './loader/parsers/textures/loadSVG.mjs';
import { loadTextures } from './loader/parsers/textures/loadTextures.mjs';
import { resolveTextureUrl } from './resolver/parsers/resolveTextureUrl.mjs';

extensions.add(
  cacheTextureArray,
  detectDefaults,
  detectAvif,
  detectWebp,
  detectMp4,
  detectOgv,
  detectWebm,
  loadJson,
  loadTxt,
  loadWebFont,
  loadSvg,
  loadTextures,
  resolveTextureUrl,
  // TODO: these should probably be moved to its own init, along with splitting out all the
  // text pipeline stuff
  xmlBitmapFontLoader,
  bitmapFontCachePlugin
);
const assetKeyMap = {
  loader: ExtensionType.LoadParser,
  resolver: ExtensionType.ResolveParser,
  cache: ExtensionType.CacheParser,
  detection: ExtensionType.DetectionParser
};
extensions.handle(ExtensionType.Asset, (extension) => {
  const ref = extension.ref;
  Object.entries(assetKeyMap).filter(([key]) => !!ref[key]).forEach(([key, type]) => extensions.add(Object.assign(
    ref[key],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: ref[key].extension ?? type }
  )));
}, (extension) => {
  const ref = extension.ref;
  Object.keys(assetKeyMap).filter((key) => !!ref[key]).forEach((key) => extensions.remove(ref[key]));
});
//# sourceMappingURL=init.mjs.map
