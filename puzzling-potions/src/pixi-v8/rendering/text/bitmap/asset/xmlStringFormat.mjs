import { settings } from '../../../../settings/settings.mjs';
import { XMLFormat } from './xmlFormat.mjs';

const XMLStringFormat = {
  test(data) {
    if (typeof data === "string" && data.includes("<font>")) {
      return XMLFormat.test(settings.ADAPTER.parseXML(data));
    }
    return false;
  },
  parse(data) {
    return XMLFormat.parse(settings.ADAPTER.parseXML(data));
  }
};

export { XMLStringFormat };
//# sourceMappingURL=xmlStringFormat.mjs.map
