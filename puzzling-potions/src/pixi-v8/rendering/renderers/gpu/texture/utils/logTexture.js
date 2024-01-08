'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var settings = require('../../../../../settings/settings.js');

function logTexture(texture, renderer) {
  const commandEncoder = renderer.gpu.device.createCommandEncoder();
  const canvas = settings.settings.ADAPTER.createCanvas();
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
  renderer.gpu.device.queue.submit([commandEncoder.finish()]);
  return canvas;
}

exports.logTexture = logTexture;
//# sourceMappingURL=logTexture.js.map
