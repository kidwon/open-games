import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { settings } from '../../../settings/settings.mjs';
import { checkDataUrl } from '../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../utils/checkExtension.mjs';
import { LoaderParserPriority } from './LoaderParser.mjs';

const validTXTExtension = ".txt";
const validTXTMIME = "text/plain";
const loadTxt = {
  name: "loadTxt",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  test(url) {
    return checkDataUrl(url, validTXTMIME) || checkExtension(url, validTXTExtension);
  },
  async load(url) {
    const response = await settings.ADAPTER.fetch(url);
    const txt = await response.text();
    return txt;
  }
};

export { loadTxt };
//# sourceMappingURL=loadTxt.mjs.map
