import { Texture } from '../../../../../rendering/renderers/shared/texture/Texture.mjs';

function createTexture(source, _loader, _url) {
  const texture = new Texture({
    source,
    label: _url
  });
  return texture;
}

export { createTexture };
//# sourceMappingURL=createTexture.mjs.map
