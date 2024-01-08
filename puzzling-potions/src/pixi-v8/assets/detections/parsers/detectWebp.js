'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var settings = require('../../../settings/settings.js');

const detectWebp = {
  extension: {
    type: Extensions.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => {
    if (!globalThis.createImageBitmap)
      return false;
    const webpData = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    const blob = await settings.settings.ADAPTER.fetch(webpData).then((r) => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  },
  add: async (formats) => [...formats, "webp"],
  remove: async (formats) => formats.filter((f) => f !== "webp")
};

exports.detectWebp = detectWebp;
//# sourceMappingURL=detectWebp.js.map
