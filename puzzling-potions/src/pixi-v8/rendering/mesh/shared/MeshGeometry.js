'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Buffer = require('../../renderers/shared/buffer/Buffer.js');
var _const = require('../../renderers/shared/buffer/const.js');
var Geometry = require('../../renderers/shared/geometry/Geometry.js');

const _MeshGeometry = class extends Geometry.Geometry {
  constructor(options = {}) {
    options = { ..._MeshGeometry.defaultOptions, ...options };
    const positions = options.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const uvs = options.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const indices = options.indices || new Uint32Array([0, 1, 2, 0, 2, 3]);
    const positionBuffer = new Buffer.Buffer({
      data: positions,
      label: "attribute-mesh-positions",
      usage: _const.BufferUsage.VERTEX | _const.BufferUsage.COPY_DST
    });
    const uvBuffer = new Buffer.Buffer({
      data: uvs,
      label: "attribute-mesh-uvs",
      usage: _const.BufferUsage.VERTEX | _const.BufferUsage.COPY_DST
    });
    const indexBuffer = new Buffer.Buffer({
      data: indices,
      label: "index-mesh-buffer",
      usage: _const.BufferUsage.INDEX | _const.BufferUsage.COPY_DST
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

exports.MeshGeometry = MeshGeometry;
//# sourceMappingURL=MeshGeometry.js.map
