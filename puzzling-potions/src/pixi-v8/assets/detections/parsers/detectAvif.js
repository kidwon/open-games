'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var settings = require('../../../settings/settings.js');

const detectAvif = {
  extension: {
    type: Extensions.ExtensionType.DetectionParser,
    priority: 1
  },
  test: async () => {
    if (!globalThis.createImageBitmap)
      return false;
    const avifData = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    const blob = await settings.settings.ADAPTER.fetch(avifData).then((r) => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  },
  add: async (formats) => [...formats, "avif"],
  remove: async (formats) => formats.filter((f) => f !== "avif")
};

exports.detectAvif = detectAvif;
//# sourceMappingURL=detectAvif.js.map
