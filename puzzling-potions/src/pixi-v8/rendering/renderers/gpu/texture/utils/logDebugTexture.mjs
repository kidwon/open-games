import { settings } from '../../../../../settings/settings.mjs';
import { WebGPURenderer } from '../../WebGPURenderer.mjs';

function textureToCanvas(texture, renderer) {
  renderer.encoder.finishRenderPass();
  const commandEncoder = renderer.encoder.commandEncoder;
  const canvas = settings.ADAPTER.createCanvas();
  canvas.width = texture.source.pixelWidth;
  canvas.height = texture.source.pixelHeight;
  const context = canvas.getContext("webgpu");
  context.configure({
    device: renderer.gpu.device,
    // eslint-disable-next-line max-len
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
    format: "bgra8unorm",
    alphaMode: "opaque"
  });
  commandEncoder.copyTextureToTexture({
    texture: renderer.texture.getGpuSource(texture.source),
    origin: {
      x: 0,
      y: 0
    }
  }, {
    texture: context.getCurrentTexture()
  }, {
    width: canvas.width,
    height: canvas.height
  });
  renderer.encoder.restoreRenderPass();
  return canvas;
}
function arrayPostDivide(pixels, out) {
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = out[i + 3] = pixels[i + 3];
    if (alpha !== 0) {
      out[i] = Math.round(Math.min(pixels[i] * 255 / alpha, 255));
      out[i + 1] = Math.round(Math.min(pixels[i + 1] * 255 / alpha, 255));
      out[i + 2] = Math.round(Math.min(pixels[i + 2] * 255 / alpha, 255));
    } else {
      out[i] = pixels[i];
      out[i + 1] = pixels[i + 1];
      out[i + 2] = pixels[i + 2];
    }
  }
}
function textureToCanvasWebGL(texture, renderer) {
  const currentRenderTarget = renderer.renderTarget.renderTarget;
  renderer.renderTarget.bind(texture, false);
  const width = Math.round(texture.source.pixelWidth);
  const height = Math.round(texture.source.pixelHeight);
  const pixels = new Uint8Array(4 * width * height);
  const canvas = settings.ADAPTER.createCanvas();
  canvas.width = width;
  canvas.height = height;
  const gl = renderer.gl;
  gl.readPixels(
    Math.round(texture.frameX),
    Math.round(texture.frameY),
    width,
    height,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels
  );
  const context = canvas.getContext("2d");
  const canvasData = context.getImageData(0, 0, width, height);
  arrayPostDivide(pixels, canvasData.data);
  context.putImageData(canvasData, 0, 0);
  const canvas2 = settings.ADAPTER.createCanvas();
  canvas2.width = width;
  canvas2.height = height;
  const context2 = canvas2.getContext("2d");
  context2.scale(1, -1);
  context2.drawImage(canvas, 0, -height);
  renderer.renderTarget.bind(currentRenderTarget, false);
  return canvas2;
}
async function logDebugTexture(texture, renderer, size = 200) {
  let canvas;
  if (renderer instanceof WebGPURenderer) {
    canvas = textureToCanvas(texture, renderer);
  } else {
    canvas = textureToCanvasWebGL(texture, renderer);
  }
  await renderer.encoder.commandFinished;
  const base64 = canvas.toDataURL();
  const width = size;
  console.log(`logging texture ${texture.source.width}px ${texture.source.height}px`);
  const style = [
    "font-size: 1px;",
    `padding: ${width}px ${300}px;`,
    `background: url(${base64}) no-repeat;`,
    "background-size: contain;"
  ].join(" ");
  console.log("%c ", style);
}

export { logDebugTexture, textureToCanvas, textureToCanvasWebGL };
//# sourceMappingURL=logDebugTexture.mjs.map
