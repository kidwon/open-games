'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../settings/settings.js');

async function isWebGPUSupported(options = {}) {
  const gpu = settings.settings.ADAPTER.getNavigator().gpu;
  if (!gpu)
    return false;
  try {
    const adapter = await navigator.gpu.requestAdapter(options);
    await adapter.requestDevice();
    return true;
  } catch (e) {
    return false;
  }
}

exports.isWebGPUSupported = isWebGPUSupported;
//# sourceMappingURL=isWebGPUSupported.js.map
