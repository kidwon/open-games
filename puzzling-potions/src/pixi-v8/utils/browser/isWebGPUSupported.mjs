import { settings } from '../../settings/settings.mjs';

async function isWebGPUSupported(options = {}) {
  const gpu = settings.ADAPTER.getNavigator().gpu;
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

export { isWebGPUSupported };
//# sourceMappingURL=isWebGPUSupported.mjs.map
