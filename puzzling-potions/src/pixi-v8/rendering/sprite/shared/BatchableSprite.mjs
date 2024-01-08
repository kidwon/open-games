class BatchableSprite {
  constructor() {
    // batch specific..
    this.vertexSize = 4;
    this.indexSize = 6;
    this.location = 0;
    // location in the buffer
    this.batcher = null;
    this.batch = null;
  }
  get blendMode() {
    return this.sprite.layerBlendMode;
  }
  packAttributes(float32View, uint32View, index, textureId) {
    const sprite = this.sprite;
    const texture = this.texture;
    const wt = sprite.layerTransform;
    const a = wt.a;
    const b = wt.b;
    const c = wt.c;
    const d = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const bounds = this.bounds;
    const w0 = bounds[0];
    const w1 = bounds[1];
    const h0 = bounds[2];
    const h1 = bounds[3];
    const uvs = texture._layout.uvs;
    const argb = sprite.layerColor;
    float32View[index++] = a * w1 + c * h1 + tx;
    float32View[index++] = d * h1 + b * w1 + ty;
    float32View[index++] = uvs.x0;
    float32View[index++] = uvs.y0;
    uint32View[index++] = argb;
    float32View[index++] = textureId;
    float32View[index++] = a * w0 + c * h1 + tx;
    float32View[index++] = d * h1 + b * w0 + ty;
    float32View[index++] = uvs.x1;
    float32View[index++] = uvs.y1;
    uint32View[index++] = argb;
    float32View[index++] = textureId;
    float32View[index++] = a * w0 + c * h0 + tx;
    float32View[index++] = d * h0 + b * w0 + ty;
    float32View[index++] = uvs.x2;
    float32View[index++] = uvs.y2;
    uint32View[index++] = argb;
    float32View[index++] = textureId;
    float32View[index++] = a * w1 + c * h0 + tx;
    float32View[index++] = d * h0 + b * w1 + ty;
    float32View[index++] = uvs.x3;
    float32View[index++] = uvs.y3;
    uint32View[index++] = argb;
    float32View[index++] = textureId;
  }
  packIndex(indexBuffer, index, indicesOffset) {
    indexBuffer[index++] = indicesOffset + 0;
    indexBuffer[index++] = indicesOffset + 1;
    indexBuffer[index++] = indicesOffset + 2;
    indexBuffer[index++] = indicesOffset + 0;
    indexBuffer[index++] = indicesOffset + 2;
    indexBuffer[index++] = indicesOffset + 3;
  }
  reset() {
    this.sprite = null;
    this.texture = null;
    this.batcher = null;
    this.batch = null;
    this.bounds = null;
  }
}

export { BatchableSprite };
//# sourceMappingURL=BatchableSprite.mjs.map
