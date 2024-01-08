'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../settings/settings.js');

function getResolutionOfUrl(url, defaultValue = 1) {
  const resolution = settings.settings.RETINA_PREFIX?.exec(url);
  if (resolution) {
    return parseFloat(resolution[1]);
  }
  return defaultValue;
}

exports.getResolutionOfUrl = getResolutionOfUrl;
//# sourceMappingURL=getResolutionOfUrl.js.map
