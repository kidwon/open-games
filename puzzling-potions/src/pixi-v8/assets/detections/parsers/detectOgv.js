'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var testVideoFormat = require('../utils/testVideoFormat.js');

const detectOgv = {
  extension: {
    type: Extensions.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat.testVideoFormat("video/ogg"),
  add: async (formats) => [...formats, "ogv"],
  remove: async (formats) => formats.filter((f) => f !== "ogv")
};

exports.detectOgv = detectOgv;
//# sourceMappingURL=detectOgv.js.map
