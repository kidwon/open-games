'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var BindGroup = require('../../renderers/gpu/shader/BindGroup.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var _const = require('../shared/const.js');

const cachedGroups = {};
function getTextureBatchBindGroup(textures) {
  const key = textures.map((t) => t.styleSourceKey).join("-");
  return cachedGroups[key] || generateTextureBatchBindGroup(textures, key);
}
function generateTextureBatchBindGroup(textures, key) {
  const bindGroupResources = {};
  let bindIndex = 0;
  for (let i = 0; i < _const.MAX_TEXTURES; i++) {
    const texture = i < textures.length ? textures[i] : Texture.Texture.EMPTY.source;
    bindGroupResources[bindIndex++] = texture.source;
    bindGroupResources[bindIndex++] = texture.style;
  }
  const bindGroup = new BindGroup.BindGroup(bindGroupResources);
  cachedGroups[key] = bindGroup;
  return bindGroup;
}

exports.getTextureBatchBindGroup = getTextureBatchBindGroup;
//# sourceMappingURL=getTextureBatchBindGroup.js.map
