'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../../../settings/settings.js');
var xmlFormat = require('./xmlFormat.js');

const XMLStringFormat = {
  test(data) {
    if (typeof data === "string" && data.includes("<font>")) {
      return xmlFormat.XMLFormat.test(settings.settings.ADAPTER.parseXML(data));
    }
    return false;
  },
  parse(data) {
    return xmlFormat.XMLFormat.parse(settings.settings.ADAPTER.parseXML(data));
  }
};

exports.XMLStringFormat = XMLStringFormat;
//# sourceMappingURL=xmlStringFormat.js.map
