import { Buffer } from '../../renderers/shared/buffer/Buffer.mjs';
import { BufferUsage } from '../../renderers/shared/buffer/const.mjs';
import { Geometry } from '../../renderers/shared/geometry/Geometry.mjs';

const _MeshGeometry = class extends Geometry {
  constructor(options = {}) {
    options = { ..._MeshGeometry.defaultOptions, ...options };
    const positions = options.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const uvs = options.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const indices = options.indices || new Uint32Array([0, 1, 2, 0, 2, 3]);
    const positionBuffer = new Buffer({
      data: positions,
      label: "attribute-mesh-positions",
      usage: BufferUsage.VERTEX | BufferUsage.COPY_DST
    });
    const uvBuffer = new Buffer({
      data: uvs,
      label: "attribute-mesh-uvs",
      usage: BufferUsage.VERTEX | BufferUsage.COPY_DST
    });
    const indexBuffer = new Buffer({
      data: indices,
      label: "index-mesh-buffer",
      usage: BufferUsage.INDEX | BufferUsage.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: positionBuffer,
          shaderLocation: 0,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: uvBuffer,
          shaderLocation: 1,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer,
      topology: options.topology
    });
    this.batchMode = "auto";
  }
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(value) {
    this.attributes.aPosition.buffer.data = value;
  }
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(value) {
    this.attributes.aUV.buffer.data = value;
  }
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(value) {
    this.indexBuffer.data = value;
  }
};
let MeshGeometry = _MeshGeometry;
MeshGeometry.defaultOptions = {
  topology: "triangle-list"
};

export { MeshGeometry };
//# sourceMappingURL=MeshGeometry.mjs.map
