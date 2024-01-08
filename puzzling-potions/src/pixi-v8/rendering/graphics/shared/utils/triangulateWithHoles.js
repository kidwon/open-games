'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var earcut = require('earcut');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var earcut__default = /*#__PURE__*/_interopDefaultLegacy(earcut);

function triangulateWithHoles(points, holes, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
  const triangles = earcut__default["default"](points, holes, 2);
  if (!triangles) {
    return;
  }
  for (let i = 0; i < triangles.length; i += 3) {
    indices[indicesOffset++] = triangles[i] + verticesOffset;
    indices[indicesOffset++] = triangles[i + 1] + verticesOffset;
    indices[indicesOffset++] = triangles[i + 2] + verticesOffset;
  }
  let index = verticesOffset * verticesStride;
  for (let i = 0; i < points.length; i += 2) {
    vertices[index] = points[i];
    vertices[index + 1] = points[i + 1];
    index += verticesStride;
  }
}

exports.triangulateWithHoles = triangulateWithHoles;
//# sourceMappingURL=triangulateWithHoles.js.map
