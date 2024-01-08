'use strict';

var Extensions = require('../extensions/Extensions.js');
var loadBitmapFont = require('../rendering/text/bitmap/asset/loadBitmapFont.js');
var cacheTextureArray = require('./cache/parsers/cacheTextureArray.js');
var detectAvif = require('./detections/parsers/detectAvif.js');
var detectDefaults = require('./detections/parsers/detectDefaults.js');
var detectMp4 = require('./detections/parsers/detectMp4.js');
var detectOgv = require('./detections/parsers/detectOgv.js');
var detectWebm = require('./detections/parsers/detectWebm.js');
var detectWebp = require('./detections/parsers/detectWebp.js');
var loadJson = require('./loader/parsers/loadJson.js');
var loadTxt = require('./loader/parsers/loadTxt.js');
var loadWebFont = require('./loader/parsers/loadWebFont.js');
var loadSVG = require('./loader/parsers/textures/loadSVG.js');
var loadTextures = require('./loader/parsers/textures/loadTextures.js');
var resolveTextureUrl = require('./resolver/parsers/resolveTextureUrl.js');

Extensions.extensions.add(
  cacheTextureArray.cacheTextureArray,
  detectDefaults.detectDefaults,
  detectAvif.detectAvif,
  detectWebp.detectWebp,
  detectMp4.detectMp4,
  detectOgv.detectOgv,
  detectWebm.detectWebm,
  loadJson.loadJson,
  loadTxt.loadTxt,
  loadWebFont.loadWebFont,
  loadSVG.loadSvg,
  loadTextures.loadTextures,
  resolveTextureUrl.resolveTextureUrl,
  // TODO: these should probably be moved to its own init, along with splitting out all the
  // text pipeline stuff
  loadBitmapFont.xmlBitmapFontLoader,
  loadBitmapFont.bitmapFontCachePlugin
);
const assetKeyMap = {
  loader: Extensions.ExtensionType.LoadParser,
  resolver: Extensions.ExtensionType.ResolveParser,
  cache: Extensions.ExtensionType.CacheParser,
  detection: Extensions.ExtensionType.DetectionParser
};
Extensions.extensions.handle(Extensions.ExtensionType.Asset, (extension) => {
  const ref = extension.ref;
  Object.entries(assetKeyMap).filter(([key]) => !!ref[key]).forEach(([key, type]) => Extensions.extensions.add(Object.assign(
    ref[key],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: ref[key].extension ?? type }
  )));
}, (extension) => {
  const ref = extension.ref;
  Object.keys(assetKeyMap).filter((key) => !!ref[key]).forEach((key) => Extensions.extensions.remove(ref[key]));
});
//# sourceMappingURL=init.js.map
