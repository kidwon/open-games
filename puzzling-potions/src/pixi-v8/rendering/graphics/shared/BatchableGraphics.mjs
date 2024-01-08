import { mixColors } from '../../scene/utils/mixColors.mjs';

class BatchableGraphics {
  constructor() {
    this.batcher = null;
    this.batch = null;
    this.applyTransform = true;
  }
  get blendMode() {
    if (this.applyTransform) {
      return this.renderable.layerBlendMode;
    }
    return "normal";
  }
  packIndex(indexBuffer, index, indicesOffset) {
    const indices = this.geometryData.indices;
    for (let i = 0; i < this.indexSize; i++) {
      indexBuffer[index++] = indices[i + this.indexOffset] + indicesOffset - this.vertexOffset;
    }
  }
  packAttributes(float32View, uint32View, index, textureId) {
    const geometry = this.geometryData;
    const positions = geometry.vertices;
    const uvs = geometry.uvs;
    const offset = this.vertexOffset * 2;
    const vertSize = (this.vertexOffset + this.vertexSize) * 2;
    const rgb = this.color;
    const bgr = rgb >> 16 | rgb & 65280 | (rgb & 255) << 16;
    if (this.applyTransform) {
      const renderable = this.renderable;
      const argb = mixColors(bgr + (this.alpha * 255 << 24), renderable.layerColor);
      const wt = renderable.layerTransform;
      const a = wt.a;
      const b = wt.b;
      const c = wt.c;
      const d = wt.d;
      const tx = wt.tx;
      const ty = wt.ty;
      for (let i = offset; i < vertSize; i += 2) {
        const x = positions[i];
        const y = positions[i + 1];
        float32View[index++] = a * x + c * y + tx;
        float32View[index++] = b * x + d * y + ty;
        float32View[index++] = uvs[i];
        float32View[index++] = uvs[i + 1];
        uint32View[index++] = argb;
        float32View[index++] = textureId;
      }
    } else {
      const argb = bgr + (this.alpha * 255 << 24);
      for (let i = offset; i < vertSize; i += 2) {
        float32View[index++] = positions[i];
        float32View[index++] = positions[i + 1];
        float32View[index++] = uvs[i];
        float32View[index++] = uvs[i + 1];
        uint32View[index++] = argb;
        float32View[index++] = textureId;
      }
    }
  }
  // TODO rename to vertexSize
  get vertSize() {
    return this.vertexSize;
  }
  copyTo(gpuBuffer) {
    gpuBuffer.indexOffset = this.indexOffset;
    gpuBuffer.indexSize = this.indexSize;
    gpuBuffer.vertexOffset = this.vertexOffset;
    gpuBuffer.vertexSize = this.vertexSize;
    gpuBuffer.color = this.color;
    gpuBuffer.alpha = this.alpha;
    gpuBuffer.texture = this.texture;
    gpuBuffer.geometryData = this.geometryData;
  }
}

export { BatchableGraphics };
//# sourceMappingURL=BatchableGraphics.mjs.map
