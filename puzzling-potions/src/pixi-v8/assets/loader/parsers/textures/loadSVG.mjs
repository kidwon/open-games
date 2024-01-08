import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { GraphicsContext } from '../../../../rendering/graphics/shared/GraphicsContext.mjs';
import { settings } from '../../../../settings/settings.mjs';
import { checkDataUrl } from '../../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../../utils/checkExtension.mjs';
import { LoaderParserPriority } from '../LoaderParser.mjs';

const SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m;
const validSVGExtension = ".svg";
const validSVGMIME = "image/svg+xml";
const loadSvg = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadSVG",
  test(url) {
    return checkDataUrl(url, validSVGMIME) || checkExtension(url, validSVGExtension);
  },
  async testParse(data) {
    return typeof data === "string" && data.startsWith("data:image/svg+xml") || typeof data === "string" && SVG_XML.test(data);
  },
  async parse(asset) {
    const context = new GraphicsContext();
    context.svg(asset);
    return context;
  },
  async load(url) {
    const response = await settings.ADAPTER.fetch(url);
    return response.text();
  }
  // TODO: unload function
};

export { loadSvg };
//# sourceMappingURL=loadSVG.mjs.map
