import { Circle } from '../../../../maths/shapes/Circle.mjs';
import { Ellipse } from '../../../../maths/shapes/Ellipse.mjs';
import { Polygon } from '../../../../maths/shapes/Polygon.mjs';
import { Rectangle } from '../../../../maths/shapes/Rectangle.mjs';
import { RoundedRectangle } from '../../../../maths/shapes/RoundedRectangle.mjs';
import { Bounds } from '../../../scene/bounds/Bounds.mjs';
import { buildAdaptiveBezier } from '../buildCommands/buildAdaptiveBezier.mjs';
import { buildAdaptiveQuadratic } from '../buildCommands/buildAdaptiveQuadratic.mjs';
import { buildArc } from '../buildCommands/buildArc.mjs';
import { buildArcTo } from '../buildCommands/buildArcTo.mjs';
import { buildArcToSvg } from '../buildCommands/buildArcToSvg.mjs';

const tempRectangle = new Rectangle();
class ShapePath {
  constructor(graphicsPath2D) {
    this.shapePrimitives = [];
    this.currentPoly = null;
    this._bounds = new Bounds();
    this.graphicsPath2D = graphicsPath2D;
  }
  moveTo(x, y) {
    this.startPoly(x, y);
    return this;
  }
  lineTo(x, y) {
    this._ensurePoly();
    const points = this.currentPoly.points;
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    if (fromX !== x || fromY !== y) {
      points.push(x, y);
    }
    return this;
  }
  arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    this._ensurePoly(false);
    const points = this.currentPoly.points;
    buildArc(points, x, y, radius, startAngle, endAngle, anticlockwise);
    return this;
  }
  arcTo(x1, y1, x2, y2, radius) {
    this._ensurePoly();
    const points = this.currentPoly.points;
    buildArcTo(points, x1, y1, x2, y2, radius);
    return this;
  }
  arcToSvg(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    const points = this.currentPoly.points;
    buildArcToSvg(
      points,
      this.currentPoly.lastX,
      this.currentPoly.lastY,
      x,
      y,
      rx,
      ry,
      xAxisRotation,
      largeArcFlag,
      sweepFlag
    );
    return this;
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._ensurePoly();
    const currentPoly = this.currentPoly;
    buildAdaptiveBezier(
      this.currentPoly.points,
      currentPoly.lastX,
      currentPoly.lastY,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      x,
      y
    );
    return this;
  }
  quadraticCurveTo(cp1x, cp1y, x, y) {
    this._ensurePoly();
    const currentPoly = this.currentPoly;
    buildAdaptiveQuadratic(
      this.currentPoly.points,
      currentPoly.lastX,
      currentPoly.lastY,
      cp1x,
      cp1y,
      x,
      y
    );
    return this;
  }
  closePath() {
    this.endPoly(true);
    return this;
  }
  addPath(path, transform) {
    this.endPoly();
    if (transform && !transform.isIdentity()) {
      path = path.clone(true);
      path.transform(transform);
    }
    for (let i = 0; i < path.instructions.length; i++) {
      const instruction = path.instructions[i];
      this[instruction.action](...instruction.data);
    }
    return this;
  }
  finish(closePath = false) {
    this.endPoly(closePath);
  }
  rect(x, y, w, h, transform) {
    this.drawShape(new Rectangle(x, y, w, h), transform);
    return this;
  }
  circle(x, y, radius, transform) {
    this.drawShape(new Circle(x, y, radius), transform);
    return this;
  }
  poly(points, close, transform) {
    const polygon = new Polygon(points);
    polygon.closePath = close;
    this.drawShape(polygon, transform);
  }
  ellipse(x, y, radiusX, radiusY, transform) {
    this.drawShape(new Ellipse(x, y, radiusX, radiusY), transform);
    return this;
  }
  roundRect(x, y, w, h, radii, transform) {
    this.drawShape(new RoundedRectangle(x, y, w, h, radii), transform);
    return this;
  }
  drawShape(shape, matrix) {
    this.endPoly();
    this.shapePrimitives.push({ shape, transform: matrix });
    return this;
  }
  startPoly(x, y) {
    let currentPoly = this.currentPoly;
    if (currentPoly) {
      this.endPoly();
    }
    currentPoly = new Polygon();
    currentPoly.points.push(x, y);
    this.currentPoly = currentPoly;
    return this;
  }
  endPoly(closePath = false) {
    const shape = this.currentPoly;
    if (shape && shape.points.length > 2) {
      shape.closePath = closePath;
      this.shapePrimitives.push({ shape });
    }
    this.currentPoly = null;
    return this;
  }
  _ensurePoly(start = true) {
    if (this.currentPoly)
      return;
    this.currentPoly = new Polygon();
    if (start) {
      const lastShape = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (lastShape) {
        let lx = lastShape.shape.x;
        let ly = lastShape.shape.y;
        if (lastShape.transform.isIdentity()) {
          const t = lastShape.transform;
          const tempX = lx;
          lx = t.a * lx + t.c * ly + t.tx;
          ly = t.b * tempX + t.d * ly + t.ty;
        }
        this.currentPoly.points.push(lx, lx);
      } else {
        this.currentPoly.points.push(0, 0);
      }
    }
  }
  buildPath() {
    const path = this.graphicsPath2D;
    this.shapePrimitives.length = 0;
    this.currentPoly = null;
    for (let i = 0; i < path.instructions.length; i++) {
      const instruction = path.instructions[i];
      this[instruction.action](...instruction.data);
    }
    this.finish();
  }
  isPointInPath(x, y) {
    const shapePrimitives = this.shapePrimitives;
    for (let i = 0; i < shapePrimitives.length; i++) {
      const shapePrimitive = shapePrimitives[i];
      if (shapePrimitive.shape.contains(x, y)) {
        return true;
      }
    }
    return false;
  }
  get bounds() {
    const bounds = this._bounds;
    bounds.clear();
    const shapePrimitives = this.shapePrimitives;
    for (let i = 0; i < shapePrimitives.length; i++) {
      const shapePrimitive = shapePrimitives[i];
      const boundsRect = shapePrimitive.shape.getBounds(tempRectangle);
      if (shapePrimitive.transform) {
        bounds.pushMatrix(shapePrimitive.transform);
        bounds.addRect(boundsRect);
        bounds.popMatrix();
      } else {
        bounds.addRect(boundsRect);
      }
    }
    return bounds;
  }
}

export { ShapePath };
//# sourceMappingURL=ShapePath.mjs.map
