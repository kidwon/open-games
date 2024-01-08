'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var triangulateWithHoles = require('../utils/triangulateWithHoles.js');

const emptyArray = [];
const buildPolygon = {
  build(shape, points) {
    for (let i = 0; i < shape.points.length; i++) {
      points[i] = shape.points[i];
    }
    return points;
  },
  triangulate(points, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
    triangulateWithHoles.triangulateWithHoles(points, emptyArray, vertices, verticesStride, verticesOffset, indices, indicesOffset);
  }
};

exports.buildPolygon = buildPolygon;
//# sourceMappingURL=buildPolygon.js.map
