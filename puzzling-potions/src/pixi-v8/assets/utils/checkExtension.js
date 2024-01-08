'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('../../utils/path.js');

function checkExtension(url, extension) {
  const tempURL = url.split("?")[0];
  const ext = path.path.extname(tempURL).toLowerCase();
  if (Array.isArray(extension)) {
    return extension.includes(ext);
  }
  return ext === extension;
}

exports.checkExtension = checkExtension;
//# sourceMappingURL=checkExtension.js.map
