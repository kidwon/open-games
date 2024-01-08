'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var settings = require('../../../settings/settings.js');
var checkDataUrl = require('../../utils/checkDataUrl.js');
var checkExtension = require('../../utils/checkExtension.js');
var LoaderParser = require('./LoaderParser.js');

const validTXTExtension = ".txt";
const validTXTMIME = "text/plain";
const loadTxt = {
  name: "loadTxt",
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validTXTMIME) || checkExtension.checkExtension(url, validTXTExtension);
  },
  async load(url) {
    const response = await settings.settings.ADAPTER.fetch(url);
    const txt = await response.text();
    return txt;
  }
};

exports.loadTxt = loadTxt;
//# sourceMappingURL=loadTxt.js.map
