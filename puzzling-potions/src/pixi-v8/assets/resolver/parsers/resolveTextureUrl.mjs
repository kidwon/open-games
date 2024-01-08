import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { settings } from '../../../settings/settings.mjs';
import { loadTextures } from '../../loader/parsers/textures/loadTextures.mjs';

const resolveTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: loadTextures.test,
  parse: (value) => ({
    resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
    format: value.split(".").pop(),
    src: value
  })
};

export { resolveTextureUrl };
//# sourceMappingURL=resolveTextureUrl.mjs.map
