'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../settings/settings.js');

let supported;
function isWebGLSupported() {
  if (typeof supported === "undefined") {
    supported = function supported2() {
      const contextOptions = {
        stencil: true,
        failIfMajorPerformanceCaveat: settings.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
      };
      try {
        if (!settings.settings.ADAPTER.getWebGLRenderingContext()) {
          return false;
        }
        const canvas = settings.settings.ADAPTER.createCanvas();
        let gl = canvas.getContext("webgl2", contextOptions);
        const success = !!gl?.getContextAttributes()?.stencil;
        if (gl) {
          const loseContext = gl.getExtension("WEBGL_lose_context");
          if (loseContext) {
            loseContext.loseContext();
          }
        }
        gl = null;
        return success;
      } catch (e) {
        return false;
      }
    }();
  }
  return supported;
}

exports.isWebGLSupported = isWebGLSupported;
//# sourceMappingURL=isWebGLSupported.js.map
