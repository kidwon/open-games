import { BindGroup } from '../../renderers/gpu/shader/BindGroup.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { MAX_TEXTURES } from '../shared/const.mjs';

const cachedGroups = {};
function getTextureBatchBindGroup(textures) {
  const key = textures.map((t) => t.styleSourceKey).join("-");
  return cachedGroups[key] || generateTextureBatchBindGroup(textures, key);
}
function generateTextureBatchBindGroup(textures, key) {
  const bindGroupResources = {};
  let bindIndex = 0;
  for (let i = 0; i < MAX_TEXTURES; i++) {
    const texture = i < textures.length ? textures[i] : Texture.EMPTY.source;
    bindGroupResources[bindIndex++] = texture.source;
    bindGroupResources[bindIndex++] = texture.style;
  }
  const bindGroup = new BindGroup(bindGroupResources);
  cachedGroups[key] = bindGroup;
  return bindGroup;
}

export { getTextureBatchBindGroup };
//# sourceMappingURL=getTextureBatchBindGroup.mjs.map
