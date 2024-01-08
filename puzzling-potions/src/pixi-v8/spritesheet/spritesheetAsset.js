'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LoaderParser = require('../assets/loader/parsers/LoaderParser.js');
var copySearchParams = require('../assets/utils/copySearchParams.js');
var Extensions = require('../extensions/Extensions.js');
var settings = require('../settings/settings.js');
var path = require('../utils/path.js');
var Spritesheet = require('./Spritesheet.js');

const validImages = ["jpg", "png", "jpeg", "avif", "webp"];
function getCacheableAssets(keys, asset, ignoreMultiPack) {
  const out = {};
  keys.forEach((key) => {
    out[key] = asset;
  });
  Object.keys(asset.textures).forEach((key) => {
    out[key] = asset.textures[key];
  });
  if (!ignoreMultiPack) {
    const basePath = path.path.dirname(keys[0]);
    asset.linkedSheets.forEach((item, i) => {
      const out2 = getCacheableAssets([`${basePath}/${asset.data.meta.related_multi_packs[i]}`], item, true);
      Object.assign(out, out2);
    });
  }
  return out;
}
const spritesheetAsset = {
  extension: Extensions.ExtensionType.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (asset) => asset instanceof Spritesheet.Spritesheet,
    getCacheableAssets: (keys, asset) => getCacheableAssets(keys, asset, false)
  },
  /** Resolve the the resolution of the asset. */
  resolver: {
    test: (value) => {
      const tempURL = value.split("?")[0];
      const split = tempURL.split(".");
      const extension = split.pop();
      const format = split.pop();
      return extension === "json" && validImages.includes(format);
    },
    parse: (value) => {
      const split = value.split(".");
      return {
        resolution: parseFloat(settings.settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
        format: split[split.length - 2],
        src: value
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into PIXI.Spritesheet
   * All textures in the sprite sheet are then added to the cache
   * @ignore
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: Extensions.ExtensionType.LoadParser,
      priority: LoaderParser.LoaderParserPriority.Normal
    },
    async testParse(asset, options) {
      return path.path.extname(options.src).toLowerCase() === ".json" && !!asset.frames;
    },
    async parse(asset, options, loader) {
      let basePath = path.path.dirname(options.src);
      if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
        basePath += "/";
      }
      let imagePath = basePath + asset.meta.image;
      imagePath = copySearchParams.copySearchParams(imagePath, options.src);
      const assets = await loader.load([imagePath]);
      const texture = assets[imagePath];
      const spritesheet = new Spritesheet.Spritesheet(
        texture.source,
        asset
      );
      await spritesheet.parse();
      const multiPacks = asset?.meta?.related_multi_packs;
      if (Array.isArray(multiPacks)) {
        const promises = [];
        for (const item of multiPacks) {
          if (typeof item !== "string") {
            continue;
          }
          let itemUrl = basePath + item;
          if (options.data?.ignoreMultiPack) {
            continue;
          }
          itemUrl = copySearchParams.copySearchParams(itemUrl, options.src);
          promises.push(loader.load({
            src: itemUrl,
            data: {
              ignoreMultiPack: true
            }
          }));
        }
        const res = await Promise.all(promises);
        spritesheet.linkedSheets = res;
        res.forEach((item) => {
          item.linkedSheets = [spritesheet].concat(spritesheet.linkedSheets.filter((sp) => sp !== item));
        });
      }
      return spritesheet;
    },
    unload(spritesheet) {
      spritesheet.destroy(true);
    }
  }
};

exports.spritesheetAsset = spritesheetAsset;
//# sourceMappingURL=spritesheetAsset.js.map
