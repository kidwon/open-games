import { nextPow2 } from '../../../../maths/pow2.mjs';
import { settings } from '../../../../settings/settings.mjs';

class CanvasPoolClass {
  constructor(canvasOptions) {
    this.poolKeyHash = {};
    this.canvasPool = {};
    this.canvasOptions = canvasOptions || {};
    this.enableFullScreen = false;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  createCanvasAndContext(pixelWidth, pixelHeight) {
    const canvas = settings.ADAPTER.createCanvas();
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const context = canvas.getContext("2d");
    return { canvas, context };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(minWidth, minHeight, resolution = 1) {
    minWidth = Math.ceil(minWidth * resolution - 1e-6);
    minHeight = Math.ceil(minHeight * resolution - 1e-6);
    minWidth = nextPow2(minWidth);
    minHeight = nextPow2(minHeight);
    const key = (minWidth << 17) + (minHeight << 1);
    if (!this.canvasPool[key]) {
      this.canvasPool[key] = [];
    }
    let canvasAndContext = this.canvasPool[key].pop();
    if (!canvasAndContext) {
      canvasAndContext = this.createCanvasAndContext(minWidth, minHeight);
    }
    return canvasAndContext;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(canvasAndContext) {
    const { width, height } = canvasAndContext.canvas;
    const key = (width << 17) + (height << 1);
    this.canvasPool[key].push(canvasAndContext);
  }
  clear() {
    this.canvasPool = {};
  }
}
const CanvasPool = new CanvasPoolClass();

export { CanvasPool, CanvasPoolClass };
//# sourceMappingURL=CanvasPool.mjs.map
