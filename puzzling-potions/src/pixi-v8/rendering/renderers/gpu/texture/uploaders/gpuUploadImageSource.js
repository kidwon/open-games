'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const gpuUploadImageResource = {
  type: "image",
  upload(source, gpuTexture, gpu) {
    const resource = source.resource;
    if (!resource)
      return;
    const width = source.resource?.width || source.pixelWidth;
    const height = source.resource?.height || source.pixelHeight;
    gpu.device.queue.copyExternalImageToTexture(
      { source: resource },
      { texture: gpuTexture },
      {
        width,
        height
      }
    );
  }
};

exports.gpuUploadImageResource = gpuUploadImageResource;
//# sourceMappingURL=gpuUploadImageSource.js.map
