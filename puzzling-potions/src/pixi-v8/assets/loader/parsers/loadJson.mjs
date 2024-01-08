import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { settings } from '../../../settings/settings.mjs';
import { checkDataUrl } from '../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../utils/checkExtension.mjs';
import { LoaderParserPriority } from './LoaderParser.mjs';

const validJSONExtension = ".json";
const validJSONMIME = "application/json";
const loadJson = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadJson",
  test(url) {
    return checkDataUrl(url, validJSONMIME) || checkExtension(url, validJSONExtension);
  },
  async load(url) {
    const response = await settings.ADAPTER.fetch(url);
    const json = await response.json();
    return json;
  }
};

export { loadJson };
//# sourceMappingURL=loadJson.mjs.map
