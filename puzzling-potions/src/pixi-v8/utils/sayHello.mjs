import { settings } from '../settings/settings.mjs';

let saidHello = false;
const VERSION = "8.0.0-alpha.1";
function sayHello(type) {
  if (saidHello) {
    return;
  }
  if (settings.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
    const args = [
      `%c  %c  %c  %c  %c PixiJS %c v${VERSION} (${type}) http://www.pixijs.com/

`,
      "background: #E72264; padding:5px 0;",
      "background: #6CA2EA; padding:5px 0;",
      "background: #B5D33D; padding:5px 0;",
      "background: #FED23F; padding:5px 0;",
      "color: #FFFFFF; background: #E72264; padding:5px 0;",
      "color: #E72264; background: #FFFFFF; padding:5px 0;"
    ];
    globalThis.console.log(...args);
  } else if (globalThis.console) {
    globalThis.console.log(`PixiJS ${VERSION} - ${type} - http://www.pixijs.com/`);
  }
  saidHello = true;
}

export { VERSION, sayHello };
//# sourceMappingURL=sayHello.mjs.map
