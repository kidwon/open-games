'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Texture = require('../../../../../rendering/renderers/shared/texture/Texture.js');

function createTexture(source, _loader, _url) {
  const texture = new Texture.Texture({
    source,
    label: _url
  });
  return texture;
}

exports.createTexture = createTexture;
//# sourceMappingURL=createTexture.js.map
