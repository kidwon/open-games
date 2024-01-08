import { MeshGeometry } from '../../../mesh/shared/MeshGeometry.mjs';
import { buildUvs, buildSimpleUvs } from '../../../renderers/shared/geometry/utils/buildUvs.mjs';
import { transformVertices } from '../../../renderers/shared/geometry/utils/transformVertices.mjs';
import { buildCircle } from '../buildCommands/buildCircle.mjs';
import { buildPolygon } from '../buildCommands/buildPolygon.mjs';
import { buildRectangle } from '../buildCommands/buildRectangle.mjs';
import { buildTriangle } from '../buildCommands/buildTriangle.mjs';

const buildMap = {
  rectangle: buildRectangle,
  polygon: buildPolygon,
  triangle: buildTriangle,
  circle: buildCircle,
  ellipse: buildCircle,
  roundedRectangle: buildCircle
};
function buildGeometryFromPath(options) {
  const vertices = [];
  const uvs = [];
  const indices = [];
  const shapePath = options.path.shapePath;
  const textureMatrix = options.textureMatrix;
  shapePath.shapePrimitives.forEach(({ shape, transform: matrix }) => {
    const indexOffset = indices.length;
    const vertOffset = vertices.length / 2;
    const points = [];
    const build = buildMap[shape.type];
    build.build(shape, points);
    if (matrix) {
      transformVertices(points, matrix);
    }
    build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
    const uvsOffset = uvs.length / 2;
    if (textureMatrix) {
      if (matrix) {
        textureMatrix.append(matrix.clone().invert());
      }
      buildUvs(vertices, 2, vertOffset, uvs, uvsOffset, 2, vertices.length / 2 - vertOffset, textureMatrix);
    } else {
      buildSimpleUvs(uvs, uvsOffset, 2, vertices.length / 2 - vertOffset);
    }
  });
  const out = options.out;
  if (out) {
    out.positions = new Float32Array(vertices);
    out.uvs = new Float32Array(uvs);
    out.indices = new Uint32Array(indices);
    return out;
  }
  const geometry = new MeshGeometry({
    positions: new Float32Array(vertices),
    uvs: new Float32Array(uvs),
    indices: new Uint32Array(indices)
  });
  return geometry;
}

export { buildGeometryFromPath };
//# sourceMappingURL=buildGeometryFromPath.mjs.map
