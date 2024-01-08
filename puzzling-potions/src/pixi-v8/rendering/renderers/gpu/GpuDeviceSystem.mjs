import { ExtensionType } from '../../../extensions/Extensions.mjs';

class GpuDeviceSystem {
  /**
   * @param {PIXI.Renderer} renderer - The renderer this System works for.
   */
  constructor(renderer) {
    this._renderer = renderer;
  }
  async init() {
    if (this._initPromise)
      return this._initPromise;
    this._initPromise = this.createDeviceAndAdaptor({}).then((gpu) => {
      this.gpu = gpu;
      this._renderer.runners.contextChange.emit(this.gpu);
    });
    return this._initPromise;
  }
  /**
   * Handle the context change event
   * @param gpu
   */
  contextChange(gpu) {
    this._renderer.gpu = gpu;
  }
  /**
   * Helper class to create a WebGL Context
   * @param {object} options - An options object that gets passed in to the canvas element containing the
   *    context attributes
   * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
   * @returns {WebGLRenderingContext} the WebGL context
   */
  async createDeviceAndAdaptor(options) {
    const adapter = await navigator.gpu.requestAdapter(options);
    const device = await adapter.requestDevice();
    return { adapter, device };
  }
  destroy() {
    this._renderer = null;
  }
}
/** @ignore */
GpuDeviceSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "device"
};

export { GpuDeviceSystem };
//# sourceMappingURL=GpuDeviceSystem.mjs.map
