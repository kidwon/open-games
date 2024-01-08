'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var settings = require('../../../settings/settings.js');
var loadTextures = require('../../loader/parsers/textures/loadTextures.js');

const resolveTextureUrl = {
  extension: Extensions.ExtensionType.ResolveParser,
  test: loadTextures.loadTextures.test,
  parse: (value) => ({
    resolution: parseFloat(settings.settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
    format: value.split(".").pop(),
    src: value
  })
};

exports.resolveTextureUrl = resolveTextureUrl;
//# sourceMappingURL=resolveTextureUrl.js.map
