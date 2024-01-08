'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var ImageSource = require('../../../../rendering/renderers/shared/texture/sources/ImageSource.js');
var settings = require('../../../../settings/settings.js');
var getResolutionOfUrl = require('../../../../utils/network/getResolutionOfUrl.js');
var checkDataUrl = require('../../../utils/checkDataUrl.js');
var checkExtension = require('../../../utils/checkExtension.js');
var LoaderParser = require('../LoaderParser.js');
var WorkerManager = require('../WorkerManager.js');
var createTexture = require('./utils/createTexture.js');

const validImageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];
const validImageMIMEs = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function loadImageBitmap(url) {
  const response = await settings.settings.ADAPTER.fetch(url);
  if (!response.ok) {
    throw new Error(`[loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const imageBlob = await response.blob();
  const imageBitmap = await createImageBitmap(imageBlob);
  return imageBitmap;
}
const loadTextures = {
  name: "loadTextures",
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High
  },
  config: {
    preferWorkers: true,
    preferCreateImageBitmap: true,
    crossOrigin: "anonymous"
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validImageMIMEs) || checkExtension.checkExtension(url, validImageExtensions);
  },
  async load(url, asset, loader) {
    let src = null;
    if (globalThis.createImageBitmap && this.config.preferCreateImageBitmap) {
      if (this.config.preferWorkers && await WorkerManager.WorkerManager.isImageBitmapSupported()) {
        src = await WorkerManager.WorkerManager.loadImageBitmap(url);
      } else {
        src = await loadImageBitmap(url);
      }
    } else {
      src = await new Promise((resolve) => {
        src = new Image();
        src.crossOrigin = this.config.crossOrigin;
        src.src = url;
        if (src.complete) {
          resolve(src);
        } else {
          src.onload = () => {
            resolve(src);
          };
        }
      });
    }
    const base = new ImageSource.ImageSource({
      resource: src,
      resolution: asset.data?.resolution || getResolutionOfUrl.getResolutionOfUrl(url),
      ...asset.data
    });
    return createTexture.createTexture(base, loader, url);
  },
  unload(texture) {
    texture.destroy(true);
  }
};

exports.loadImageBitmap = loadImageBitmap;
exports.loadTextures = loadTextures;
//# sourceMappingURL=loadTextures.js.map
