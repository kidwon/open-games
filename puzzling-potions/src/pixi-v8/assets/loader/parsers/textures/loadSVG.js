'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var GraphicsContext = require('../../../../rendering/graphics/shared/GraphicsContext.js');
var settings = require('../../../../settings/settings.js');
var checkDataUrl = require('../../../utils/checkDataUrl.js');
var checkExtension = require('../../../utils/checkExtension.js');
var LoaderParser = require('../LoaderParser.js');

const SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m;
const validSVGExtension = ".svg";
const validSVGMIME = "image/svg+xml";
const loadSvg = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low
  },
  name: "loadSVG",
  test(url) {
    return checkDataUrl.checkDataUrl(url, validSVGMIME) || checkExtension.checkExtension(url, validSVGExtension);
  },
  async testParse(data) {
    return typeof data === "string" && data.startsWith("data:image/svg+xml") || typeof data === "string" && SVG_XML.test(data);
  },
  async parse(asset) {
    const context = new GraphicsContext.GraphicsContext();
    context.svg(asset);
    return context;
  },
  async load(url) {
    const response = await settings.settings.ADAPTER.fetch(url);
    return response.text();
  }
  // TODO: unload function
};

exports.loadSvg = loadSvg;
//# sourceMappingURL=loadSVG.js.map
