import { isWebGLSupported } from '../../utils/browser/isWebGLSupported.mjs';
import { isWebGPUSupported } from '../../utils/browser/isWebGPUSupported.mjs';

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
    await import('../../all.mjs');
  }
  let finalOptions = {};
  for (let i = 0; i < preferredOrder.length; i++) {
    const rendererType = preferredOrder[i];
    if (rendererType === "webgpu" && await isWebGPUSupported()) {
      const { WebGPURenderer } = await import('./gpu/WebGPURenderer.mjs');
      RendererClass = WebGPURenderer;
      finalOptions = { ...options, ...options.webgpu };
      break;
    } else if (rendererType === "webgl" && isWebGLSupported()) {
      const { WebGLRenderer } = await import('./gl/WebGLRenderer.mjs');
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

export { autoDetectRenderer };
//# sourceMappingURL=autoDetectRenderer.mjs.map
