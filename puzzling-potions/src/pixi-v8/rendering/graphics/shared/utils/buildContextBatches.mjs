import { Rectangle } from '../../../../maths/shapes/Rectangle.mjs';
import { BigPool } from '../../../../utils/pool/PoolGroup.mjs';
import { buildUvs, buildSimpleUvs } from '../../../renderers/shared/geometry/utils/buildUvs.mjs';
import { transformVertices } from '../../../renderers/shared/geometry/utils/transformVertices.mjs';
import { Texture } from '../../../renderers/shared/texture/Texture.mjs';
import { BatchableGraphics } from '../BatchableGraphics.mjs';
import { buildCircle } from '../buildCommands/buildCircle.mjs';
import { buildLine } from '../buildCommands/buildLine.mjs';
import { buildPolygon } from '../buildCommands/buildPolygon.mjs';
import { buildRectangle } from '../buildCommands/buildRectangle.mjs';
import { buildTriangle } from '../buildCommands/buildTriangle.mjs';
import { triangulateWithHoles } from './triangulateWithHoles.mjs';

const buildMap = {
  rectangle: buildRectangle,
  polygon: buildPolygon,
  triangle: buildTriangle,
  circle: buildCircle,
  ellipse: buildCircle,
  roundedRectangle: buildCircle
};
const tempRect = new Rectangle();
function buildContextBatches(context) {
  const vertices = [];
  const uvs = [];
  const indices = [];
  const geometryData = {
    vertices,
    uvs,
    indices
  };
  const batches = [];
  for (let i = 0; i < context.instructions.length; i++) {
    const instruction = context.instructions[i];
    if (instruction.action === "texture") {
      addTextureToGeometryData(instruction.data, batches, geometryData);
    } else if (instruction.action === "fill" || instruction.action === "stroke") {
      const isStroke = instruction.action === "stroke";
      const shapePath = instruction.data.path.shapePath;
      const style = instruction.data.style;
      const hole = instruction.data.hole;
      if (isStroke && hole) {
        addShapePathToGeometryData(hole.shapePath, style, null, true, batches, geometryData);
      }
      addShapePathToGeometryData(shapePath, style, hole, isStroke, batches, geometryData);
    }
  }
  return batches;
}
function addTextureToGeometryData(data, batches, geometryData) {
  const { vertices, uvs, indices } = geometryData;
  const indexOffset = indices.length;
  const vertOffset = vertices.length / 2;
  const points = [];
  const build = buildMap.rectangle;
  const rect = tempRect;
  const texture = data.image;
  rect.x = data.dx;
  rect.y = data.dy;
  rect.width = data.dw;
  rect.height = data.dh;
  const matrix = data.transform;
  build.build(rect, points);
  if (matrix) {
    transformVertices(points, matrix);
  }
  build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
  const textureUvs = texture.layout.uvs;
  uvs.push(
    textureUvs.x0,
    textureUvs.y0,
    textureUvs.x1,
    textureUvs.y1,
    textureUvs.x3,
    textureUvs.y3,
    textureUvs.x2,
    textureUvs.y2
  );
  const graphicsBatch = BigPool.get(BatchableGraphics);
  graphicsBatch.indexOffset = indexOffset;
  graphicsBatch.indexSize = indices.length - indexOffset;
  graphicsBatch.vertexOffset = vertOffset;
  graphicsBatch.vertexSize = vertices.length / 2 - vertOffset;
  graphicsBatch.color = data.style;
  graphicsBatch.alpha = data.alpha;
  graphicsBatch.texture = texture;
  graphicsBatch.geometryData = geometryData;
  batches.push(graphicsBatch);
}
function addShapePathToGeometryData(shapePath, style, hole, isStroke, batches, geometryData) {
  const { vertices, uvs, indices } = geometryData;
  const lastIndex = shapePath.shapePrimitives.length - 1;
  shapePath.shapePrimitives.forEach(({ shape, transform: matrix }, i) => {
    const indexOffset = indices.length;
    const vertOffset = vertices.length / 2;
    const points = [];
    const build = buildMap[shape.type];
    build.build(shape, points);
    if (matrix) {
      transformVertices(points, matrix);
    }
    if (!isStroke) {
      if (hole && lastIndex === i) {
        if (lastIndex !== 0) {
          console.warn("[Pixi Graphics] only the last shape have be cut out");
        }
        const holeIndices = [];
        const otherPoints = points.slice();
        const holeArrays = getHoleArrays(hole.shapePath);
        holeArrays.forEach((holePoints) => {
          holeIndices.push(otherPoints.length / 2);
          otherPoints.push(...holePoints);
        });
        triangulateWithHoles(otherPoints, holeIndices, vertices, 2, vertOffset, indices, indexOffset);
      } else {
        build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
      }
    } else {
      const close = shape.closePath ?? true;
      const lineStyle = style;
      buildLine(points, lineStyle, false, close, vertices, 2, vertOffset, indices, indexOffset);
    }
    const uvsOffset = uvs.length / 2;
    const texture = style.texture;
    if (texture !== Texture.WHITE) {
      const textureMatrix = style.matrix;
      if (matrix) {
        textureMatrix.append(matrix.clone().invert());
      }
      buildUvs(vertices, 2, vertOffset, uvs, uvsOffset, 2, vertices.length / 2 - vertOffset, textureMatrix);
    } else {
      buildSimpleUvs(uvs, uvsOffset, 2, vertices.length / 2 - vertOffset);
    }
    const graphicsBatch = BigPool.get(BatchableGraphics);
    graphicsBatch.indexOffset = indexOffset;
    graphicsBatch.indexSize = indices.length - indexOffset;
    graphicsBatch.vertexOffset = vertOffset;
    graphicsBatch.vertexSize = vertices.length / 2 - vertOffset;
    graphicsBatch.color = style.color;
    graphicsBatch.alpha = style.alpha;
    graphicsBatch.texture = texture;
    graphicsBatch.geometryData = geometryData;
    batches.push(graphicsBatch);
  });
}
function getHoleArrays(shape) {
  if (!shape)
    return [];
  const holePrimitives = shape.shapePrimitives;
  const holeArrays = [];
  for (let k = 0; k < holePrimitives.length; k++) {
    const holePrimitive = holePrimitives[k].shape;
    const holePoints = [];
    const holeBuilder = buildMap[holePrimitive.type];
    holeBuilder.build(holePrimitive, holePoints);
    holeArrays.push(holePoints);
  }
  return holeArrays;
}

export { buildContextBatches };
//# sourceMappingURL=buildContextBatches.mjs.map
