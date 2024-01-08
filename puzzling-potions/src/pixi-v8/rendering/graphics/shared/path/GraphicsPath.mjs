import { Point } from '../../../../maths/Point.mjs';
import { SVGToGraphicsPath } from '../svg/SVGToGraphicsPath.mjs';
import { ShapePath } from './ShapePath.mjs';

let UID = 0;
class GraphicsPath {
  constructor(instructions) {
    this.instructions = [];
    this.uid = UID++;
    this.dirty = true;
    if (typeof instructions === "string") {
      SVGToGraphicsPath(instructions, this);
    } else {
      this.instructions = instructions?.slice() ?? [];
    }
  }
  get shapePath() {
    if (!this._shapePath) {
      this._shapePath = new ShapePath(this);
    }
    if (this.dirty) {
      this.dirty = false;
      this._shapePath.buildPath();
    }
    return this._shapePath;
  }
  addPath(path, transform) {
    path = path.clone();
    this.instructions.push({ action: "addPath", data: [path, transform] });
    this.dirty = true;
    return this;
  }
  arc(...args) {
    this.instructions.push({ action: "arc", data: args });
    this.dirty = true;
    return this;
  }
  arcTo(...args) {
    this.instructions.push({ action: "arcTo", data: args });
    this.dirty = true;
    return this;
  }
  arcToSvg(...args) {
    this.instructions.push({ action: "arcToSvg", data: args });
    this.dirty = true;
    return this;
  }
  bezierCurveTo(...args) {
    this.instructions.push({ action: "bezierCurveTo", data: args });
    this.dirty = true;
    return this;
  }
  bezierCurveToShort(cp2x, cp2y, x, y) {
    const last = this.instructions[this.instructions.length - 1];
    const lastPoint = this.getLastPoint(Point.shared);
    let cp1x = 0;
    let cp1y = 0;
    if (!last || last.action !== "bezierCurveTo") {
      cp1x = lastPoint.x;
      cp1y = lastPoint.y;
    } else {
      cp1x = last.data[2];
      cp1y = last.data[3];
      const currentX = lastPoint.x;
      const currentY = lastPoint.y;
      cp1x = currentX + (currentX - cp1x);
      cp1y = currentY + (currentY - cp1y);
    }
    this.instructions.push({ action: "bezierCurveTo", data: [cp1x, cp1y, cp2x, cp2y, x, y] });
    this.dirty = true;
    return this;
  }
  closePath() {
    this.instructions.push({ action: "closePath", data: [] });
    this.dirty = true;
    return this;
  }
  ellipse(...args) {
    this.instructions.push({ action: "ellipse", data: args });
    this.dirty = true;
    return this;
  }
  lineTo(...args) {
    this.instructions.push({ action: "lineTo", data: args });
    this.dirty = true;
    return this;
  }
  moveTo(...args) {
    this.instructions.push({ action: "moveTo", data: args });
    return this;
  }
  quadraticCurveTo(...args) {
    this.instructions.push({ action: "quadraticCurveTo", data: args });
    this.dirty = true;
    return this;
  }
  quadraticCurveToShort(x, y) {
    const last = this.instructions[this.instructions.length - 1];
    const lastPoint = this.getLastPoint(Point.shared);
    let cpx1 = 0;
    let cpy1 = 0;
    if (!last || last.action !== "quadraticCurveTo") {
      cpx1 = lastPoint.x;
      cpy1 = lastPoint.y;
    } else {
      cpx1 = last.data[0];
      cpy1 = last.data[1];
      const currentX = lastPoint.x;
      const currentY = lastPoint.y;
      cpx1 = currentX + (currentX - cpx1);
      cpy1 = currentY + (currentY - cpy1);
    }
    this.instructions.push({ action: "quadraticCurveTo", data: [cpx1, cpy1, x, y] });
    this.dirty = true;
    return this;
  }
  rect(x, y, w, h, transform) {
    this.instructions.push({ action: "rect", data: [x, y, w, h, transform] });
    this.dirty = true;
    return this;
  }
  circle(x, y, radius, transform) {
    this.instructions.push({ action: "circle", data: [x, y, radius, transform] });
    this.dirty = true;
    return this;
  }
  roundRect(...args) {
    this.instructions.push({ action: "roundRect", data: args });
    this.dirty = true;
    return this;
  }
  poly(...args) {
    this.instructions.push({ action: "poly", data: args });
    this.dirty = true;
    return this;
  }
  star(x, y, points, radius, innerRadius, rotation = 0, transform) {
    innerRadius = innerRadius || radius / 2;
    const startAngle = -1 * Math.PI / 2 + rotation;
    const len = points * 2;
    const delta = Math.PI * 2 / len;
    const polygon = [];
    for (let i = 0; i < len; i++) {
      const r = i % 2 ? innerRadius : radius;
      const angle = i * delta + startAngle;
      polygon.push(
        x + r * Math.cos(angle),
        y + r * Math.sin(angle)
      );
    }
    this.poly(polygon, true, transform);
    return this;
  }
  clone(deep = false) {
    const newGraphicsPath2D = new GraphicsPath();
    if (!deep) {
      newGraphicsPath2D.instructions = this.instructions.slice();
    } else {
      for (let i = 0; i < this.instructions.length; i++) {
        const instruction = this.instructions[i];
        newGraphicsPath2D.instructions.push({ action: instruction.action, data: instruction.data.slice() });
      }
    }
    return newGraphicsPath2D;
  }
  getLastPoint(out) {
    let index = this.instructions.length - 1;
    let lastInstruction = this.instructions[index];
    if (!lastInstruction) {
      out.x = 0;
      out.y = 0;
      return out;
    }
    while (lastInstruction.action === "closePath") {
      index--;
      if (index < 0) {
        out.x = 0;
        out.y = 0;
        return out;
      }
      lastInstruction = this.instructions[index];
    }
    let x;
    let y;
    let transform;
    switch (lastInstruction.action) {
      case "moveTo":
      case "lineTo":
        out.x = lastInstruction.data[0];
        out.y = lastInstruction.data[1];
        break;
      case "quadraticCurveTo":
        out.x = lastInstruction.data[2];
        out.y = lastInstruction.data[3];
        break;
      case "bezierCurveTo":
        out.x = lastInstruction.data[4];
        out.y = lastInstruction.data[5];
        break;
      case "arc":
      case "arcToSvg":
        out.x = lastInstruction.data[5];
        out.y = lastInstruction.data[6];
        break;
      case "addPath":
        out.x = lastInstruction.data[0].lastX;
        out.y = lastInstruction.data[2].lastY;
        break;
      case "rect":
        transform = lastInstruction.data[4];
        x = lastInstruction.data[0];
        y = lastInstruction.data[1];
        if (transform) {
          const { a, b, c, d, tx, ty } = transform;
          out.x = a * x + c * y + tx;
          out.y = b * x + d * y + ty;
        } else {
          out.x = x;
          out.y = y;
        }
        break;
      default:
        console.warn(`${lastInstruction.action} is not supported yet`);
        break;
    }
    return out;
  }
  clear() {
    this.instructions.length = 0;
    this.dirty = true;
    return this;
  }
  transform(matrix) {
    if (matrix.isIdentity())
      return this;
    const a = matrix.a;
    const b = matrix.b;
    const c = matrix.c;
    const d = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    let x = 0;
    let y = 0;
    let cpx1 = 0;
    let cpy1 = 0;
    let cpx2 = 0;
    let cpy2 = 0;
    let rx = 0;
    let ry = 0;
    for (let i = 0; i < this.instructions.length; i++) {
      const instruction = this.instructions[i];
      const data = instruction.data;
      switch (instruction.action) {
        case "moveTo":
        case "lineTo":
          x = data[0];
          y = data[1];
          data[0] = a * x + c * y + tx;
          data[1] = b * x + d * y + ty;
          break;
        case "bezierCurveTo":
          cpx1 = data[0];
          cpy1 = data[1];
          cpx2 = data[2];
          cpy2 = data[3];
          x = data[4];
          y = data[5];
          data[0] = a * cpx1 + c * cpy1 + tx;
          data[1] = b * cpx1 + d * cpy1 + ty;
          data[2] = a * cpx2 + c * cpy2 + tx;
          data[3] = b * cpx2 + d * cpy2 + ty;
          data[4] = a * x + c * y + tx;
          data[5] = b * x + d * y + ty;
          break;
        case "quadraticCurveTo":
          cpx1 = data[0];
          cpy1 = data[1];
          x = data[2];
          y = data[3];
          data[0] = a * cpx1 + c * cpy1 + tx;
          data[1] = b * cpx1 + d * cpy1 + ty;
          data[2] = a * x + c * y + tx;
          data[3] = b * x + d * y + ty;
          break;
        case "arcToSvg":
          x = data[5];
          y = data[6];
          rx = data[0];
          ry = data[1];
          data[0] = a * rx + c * ry;
          data[1] = b * rx + d * ry;
          data[5] = a * x + c * y + tx;
          data[6] = b * x + d * y + ty;
          break;
        case "rect":
          data[4] = adjustTransform(data[4], matrix);
          break;
        case "ellipse":
          data[8] = adjustTransform(data[8], matrix);
          break;
        case "roundRect":
          data[5] = adjustTransform(data[5], matrix);
          break;
        case "addPath":
          data[0].transform(matrix);
          break;
        default:
          console.warn("unknown transform action", instruction.action);
          break;
      }
    }
    this.dirty = true;
    return this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
}
function adjustTransform(currentMatrix, transform) {
  if (currentMatrix) {
    return currentMatrix.prepend(transform);
  }
  return transform.clone();
}

export { GraphicsPath };
//# sourceMappingURL=GraphicsPath.mjs.map
