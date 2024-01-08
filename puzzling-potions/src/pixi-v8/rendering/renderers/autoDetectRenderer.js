'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWebGLSupported = require('../../utils/browser/isWebGLSupported.js');
var isWebGPUSupported = require('../../utils/browser/isWebGPUSupported.js');

const renderPriority = ["webgpu", "webgl", "canvas"];
async function autoDetectRenderer(options) {
  let preferredOrder = [];
  if (options.preference) {
    preferredOrder.push(options.preference);
    renderPriority.forEach((item) => {
      if (item !== options.preference) {
        preferredOrder.push(item);
      }
    });
  } else {
    preferredOrder = renderPriority.slice();
  }
  let RendererClass;
  if (options.manageImports ?? true) {
    await Promise.resolve().then(function () { return require('../../all.js'); });
  }
  let finalOptions = {};
  for (let i = 0; i < preferredOrder.length; i++) {
    const rendererType = preferredOrder[i];
    if (rendererType === "webgpu" && await isWebGPUSupported.isWebGPUSupported()) {
      const { WebGPURenderer } = await Promise.resolve().then(function () { return require('./gpu/WebGPURenderer.js'); });
      RendererClass = WebGPURenderer;
      finalOptions = { ...options, ...options.webgpu };
      break;
    } else if (rendererType === "webgl" && isWebGLSupported.isWebGLSupported()) {
      const { WebGLRenderer } = await Promise.resolve().then(function () { return require('./gl/WebGLRenderer.js'); });
      RendererClass = WebGLRenderer;
      finalOptions = { ...options, ...options.webgl };
      break;
    } else if (rendererType === "canvas") {
      finalOptions = { ...options };
      break;
    }
  }
  delete finalOptions.webgpu;
  delete finalOptions.webgl;
  const renderer = new RendererClass();
  await renderer.init(finalOptions);
  return renderer;
}

exports.autoDetectRenderer = autoDetectRenderer;
//# sourceMappingURL=autoDetectRenderer.js.map
