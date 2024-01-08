class BatchableMesh {
  constructor() {
    this.batcher = null;
    this.batch = null;
  }
  get blendMode() {
    return this.renderable.layerBlendMode;
  }
  reset() {
    this.renderable = null;
    this.texture = null;
    this.batcher = null;
    this.batch = null;
  }
  packIndex(indexBuffer, index, indicesOffset) {
    const indices = this.renderable.view.geometry.indices;
    for (let i = 0; i < indices.length; i++) {
      indexBuffer[index++] = indices[i] + indicesOffset;
    }
  }
  packAttributes(float32View, uint32View, index, textureId) {
    const renderable = this.renderable;
    const geometry = this.renderable.view.geometry;
    const wt = renderable.layerTransform;
    const a = wt.a;
    const b = wt.b;
    const c = wt.c;
    const d = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const positions = geometry.positions;
    const uvs = geometry.uvs;
    const abgr = renderable.layerColor;
    for (let i = 0; i < positions.length; i += 2) {
      const x = positions[i];
      const y = positions[i + 1];
      float32View[index++] = a * x + c * y + tx;
      float32View[index++] = b * x + d * y + ty;
      float32View[index++] = uvs[i];
      float32View[index++] = uvs[i + 1];
      uint32View[index++] = abgr;
      float32View[index++] = textureId;
    }
  }
  get vertexSize() {
    return this.renderable.view.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.renderable.view.geometry.indices.length;
  }
}

export { BatchableMesh };
//# sourceMappingURL=BatchableMesh.mjs.map
