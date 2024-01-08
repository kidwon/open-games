import EventEmitter from 'eventemitter3';
import { Matrix } from '../../../maths/Matrix.mjs';
import { Point } from '../../../maths/Point.mjs';
import { convertColorToNumber } from '../../../utils/color/convertColorToNumber.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { Bounds } from '../../scene/bounds/Bounds.mjs';
import { FillGradient } from './fill/FillGradient.mjs';
import { FillPattern } from './fill/FillPattern.mjs';
import { GraphicsPath } from './path/GraphicsPath.mjs';
import { SVGParser } from './svg/SVGParser.mjs';
import { convertFillInputToFillStyle } from './utils/convertFillInputToFillStyle.mjs';

let UID = 0;
const tmpPoint = new Point();
const tempMatrix = new Matrix();
const _GraphicsContext = class extends EventEmitter {
  constructor() {
    super(...arguments);
    this.uid = UID++;
    this.usage = 0;
    this.dirty = true;
    this.batchMode = "auto";
    this.instructions = [];
    this.activePath = new GraphicsPath();
    this._transform = new Matrix();
    this._fillStyle = { ..._GraphicsContext.defaultFillStyle };
    this._fillStyleOriginal = 16777215;
    this._strokeStyle = { ..._GraphicsContext.defaultStrokeStyle };
    this._strokeStyleOriginal = 16777215;
    this._stateStack = [];
    this._tick = 0;
    this._bounds = new Bounds();
    this.boundsDirty = true;
  }
  set fillStyle(value) {
    if (this._fillStyleOriginal === value)
      return;
    this._fillStyleOriginal = value;
    if (typeof value === "number" || typeof value === "string") {
      this._fillStyle.color = convertColorToNumber(value);
      this._fillStyle.texture = Texture.WHITE;
    } else if (value instanceof FillPattern) {
      const pattern = value;
      this._fillStyle.color = 16777215;
      this._fillStyle.texture = pattern.texture;
      this._fillStyle.matrix = pattern.transform;
    } else if (value instanceof FillGradient) {
      const gradient = value;
      gradient.buildLinearGradient();
      this._fillStyle.color = 16777215;
      this._fillStyle.texture = gradient.texture;
      this._fillStyle.matrix = gradient.transform;
    } else {
      this._fillStyle = { ..._GraphicsContext.defaultFillStyle, ...value };
    }
  }
  get fillStyle() {
    return this._fillStyleOriginal;
  }
  set strokeStyle(value) {
    if (this._strokeStyleOriginal === value)
      return;
    this._strokeStyleOriginal = value;
    if (typeof value === "number" || typeof value === "string") {
      this._strokeStyle.color = convertColorToNumber(value);
      this._strokeStyle.texture = Texture.WHITE;
    } else if (value instanceof FillGradient) {
      const gradient = value;
      gradient.buildLinearGradient();
      this._strokeStyle.color = 16777215;
      this._strokeStyle.texture = gradient.texture;
      this._strokeStyle.matrix = gradient.transform;
    } else {
      this._strokeStyle = { ..._GraphicsContext.defaultStrokeStyle, ...value };
    }
  }
  get strokeStyle() {
    return this._strokeStyleOriginal;
  }
  setFillStyle(style) {
    this.fillStyle = style;
    return this;
  }
  setStrokeStyle(style) {
    this.strokeStyle = style;
    return this;
  }
  texture(texture, tint, dx, dy, dw, dh) {
    this.instructions.push({
      action: "texture",
      data: {
        image: texture,
        dx: dx || 0,
        dy: dy || 0,
        dw: dw || texture.frameWidth,
        dh: dh || texture.frameHeight,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: tint || 16777215
      }
    });
    this.onUpdate();
    return this;
  }
  beginPath() {
    this.activePath = new GraphicsPath();
    return this;
  }
  fill(style) {
    let path;
    const lastInstruction = this.instructions[this.instructions.length - 1];
    if (this._tick === 0 && lastInstruction && lastInstruction.action === "stroke") {
      path = lastInstruction.data.path;
    } else {
      path = this.activePath.clone();
    }
    if (!path)
      return this;
    let fillStyle = this._fillStyle;
    if (style) {
      fillStyle = convertFillInputToFillStyle(style, _GraphicsContext.defaultFillStyle);
    }
    this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: fillStyle, path }
    });
    this.onUpdate();
    this.activePath.instructions.length = 0;
    this._tick = 0;
    return this;
  }
  stroke(style) {
    let path;
    const lastInstruction = this.instructions[this.instructions.length - 1];
    if (this._tick === 0 && lastInstruction && lastInstruction.action === "fill") {
      path = lastInstruction.data.path;
    } else {
      path = this.activePath.clone();
    }
    if (!path)
      return this;
    let strokeStyle = this._strokeStyle;
    if (style) {
      strokeStyle = convertFillInputToFillStyle(style, _GraphicsContext.defaultStrokeStyle);
    }
    this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: strokeStyle, path }
    });
    this.onUpdate();
    this.activePath.instructions.length = 0;
    this._tick = 0;
    return this;
  }
  cut() {
    for (let i = 0; i < 2; i++) {
      const lastInstruction = this.instructions[this.instructions.length - 1 - i];
      const holePath = this.activePath.clone();
      if (lastInstruction) {
        if (lastInstruction.action === "stroke" || lastInstruction.action === "fill") {
          lastInstruction.data.hole = holePath;
        }
      }
    }
    this.activePath.instructions.length = 0;
    return this;
  }
  arc(x, y, radius, startAngle, endAngle, counterclockwise) {
    this._tick++;
    const t = this._transform;
    this.activePath.arc(
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty,
      radius,
      startAngle,
      endAngle,
      counterclockwise
    );
    return this;
  }
  arcTo(x1, y1, x2, y2, radius) {
    this._tick++;
    const t = this._transform;
    this.activePath.arcTo(
      t.a * x1 + t.c * y1 + t.tx,
      t.b * x1 + t.d * y1 + t.ty,
      t.a * x2 + t.c * y2 + t.tx,
      t.b * x2 + t.d * y2 + t.ty,
      radius
    );
    return this;
  }
  arcToSvg(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    this._tick++;
    const t = this._transform;
    this.activePath.arcToSvg(
      rx,
      ry,
      xAxisRotation,
      // should we rotate this with transform??
      largeArcFlag,
      sweepFlag,
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty
    );
    return this;
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._tick++;
    const t = this._transform;
    this.activePath.bezierCurveTo(
      t.a * cp1x + t.c * cp1y + t.tx,
      t.b * cp1x + t.d * cp1y + t.ty,
      t.a * cp2x + t.c * cp2y + t.tx,
      t.b * cp2x + t.d * cp2y + t.ty,
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty
    );
    return this;
  }
  closePath() {
    this._tick++;
    this.activePath?.closePath();
    return this;
  }
  ellipse(x, y, radiusX, radiusY) {
    this._tick++;
    this.activePath.ellipse(x, y, radiusX, radiusY, this._transform.clone());
    return this;
  }
  circle(x, y, radius) {
    this._tick++;
    this.activePath.circle(x, y, radius, this._transform.clone());
    return this;
  }
  path(path) {
    this._tick++;
    this.activePath.addPath(path, this._transform.clone());
    return this;
  }
  lineTo(x, y) {
    this._tick++;
    const t = this._transform;
    this.activePath.lineTo(
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty
    );
    return this;
  }
  moveTo(x, y) {
    this._tick++;
    const t = this._transform;
    this.activePath.moveTo(
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty
    );
    return this;
  }
  quadraticCurveTo(cpx, cpy, x, y) {
    this._tick++;
    const t = this._transform;
    this.activePath.quadraticCurveTo(
      t.a * cpx + t.c * cpy + t.tx,
      t.b * cpx + t.d * cpy + t.ty,
      t.a * x + t.c * y + t.tx,
      t.b * x + t.d * y + t.ty
    );
  }
  rect(x, y, w, h) {
    this._tick++;
    this.activePath.rect(x, y, w, h, this._transform.clone());
    return this;
  }
  roundRect(x, y, w, h, radii) {
    this._tick++;
    this.activePath.roundRect(x, y, w, h, radii, this._transform.clone());
    return this;
  }
  poly(points, close) {
    this._tick++;
    this.activePath.poly(points, close, this._transform.clone());
    return this;
  }
  star(x, y, points, radius, innerRadius, rotation) {
    this._tick++;
    this.activePath.star(x, y, points, radius, innerRadius, rotation, this._transform.clone());
    return this;
  }
  svg(svg) {
    this._tick++;
    SVGParser(svg, this);
  }
  restore() {
    const state = this._stateStack.pop();
    if (state) {
      this._transform = state.transform;
      this._fillStyle = state.fillStyle;
      this._strokeStyle = state.strokeStyle;
    }
  }
  save() {
    this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    });
  }
  getTransform() {
    return this._transform;
  }
  resetTransform() {
    this._transform.identity();
    return this;
  }
  rotate(angle) {
    this._transform.rotate(angle);
    return this;
  }
  scale(x, y = x) {
    this._transform.scale(x, y);
    return this;
  }
  setTransform(a, b, c, d, dx, dy) {
    if (a instanceof Matrix) {
      this._transform.set(a.a, a.b, a.c, a.d, a.tx, a.ty);
      return this;
    }
    this._transform.set(a, b, c, d, dx, dy);
    return this;
  }
  transform(a, b, c, d, dx, dy) {
    if (a instanceof Matrix) {
      this._transform.append(a);
      return this;
    }
    tempMatrix.set(a, b, c, d, dx, dy);
    this._transform.append(tempMatrix);
    return this;
  }
  translate(x, y) {
    this._transform.translate(x, y);
    return this;
  }
  clear() {
    this.instructions.length = 0;
    this.resetTransform();
    this.onUpdate();
    return this;
  }
  onUpdate() {
    if (this.dirty)
      return;
    this.emit("update", this, 16);
    this.dirty = true;
    this.boundsDirty = true;
  }
  get bounds() {
    if (!this.boundsDirty)
      return this._bounds;
    const bounds = this._bounds;
    bounds.clear();
    for (let i = 0; i < this.instructions.length; i++) {
      const instruction = this.instructions[i];
      const action = instruction.action;
      if (action === "fill") {
        const data = instruction.data;
        bounds.addBounds(data.path.bounds);
      } else if (action === "texture") {
        const data = instruction.data;
        bounds.pushMatrix(data.transform);
        bounds.addFrame(data.dx, data.dy, data.dx + data.dw, data.dy + data.dh);
        bounds.popMatrix();
      }
    }
    return bounds;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(point) {
    const instructions = this.instructions;
    let hasHit = false;
    instructions.forEach((instruction) => {
      const data = instruction.data;
      const path = data.path;
      if (!instruction.action || !path)
        return;
      const style = data.style;
      const shapes = path.shapePath?.shapePrimitives;
      this._forEachShape(shapes, (shape) => {
        if (!style || !shape)
          return;
        if (typeof style !== "number" && style.matrix) {
          style.matrix.applyInverse(point, tmpPoint);
        } else {
          tmpPoint.copyFrom(point);
        }
        hasHit = shape.contains(tmpPoint.x, tmpPoint.y);
        const holes = data.hole;
        if (!holes)
          return;
        const holeShapes = holes.shapePath?.shapePrimitives;
        if (!holeShapes)
          return;
        this._forEachShape(holeShapes, (hole) => {
          if (hole.contains(tmpPoint.x, tmpPoint.y)) {
            hasHit = false;
          }
        });
      });
    });
    return hasHit;
  }
  _forEachShape(shapes, callback) {
    shapes?.forEach((shapePrimitive) => {
      const shape = shapePrimitive?.shape;
      if (shape) {
        callback(shape);
      }
    });
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the fill/stroke style?
   * @param {boolean} [options.textureSource=false] - Should it destroy the texture source of the fill/stroke style?
   */
  destroy(options = false) {
    this._stateStack.length = 0;
    this._transform = null;
    this.emit("destroy", this);
    this.removeAllListeners();
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      if (this._fillStyle.texture) {
        this._fillStyle.texture.destroy(destroyTextureSource);
      }
      if (this._strokeStyle.texture) {
        this._strokeStyle.texture.destroy(destroyTextureSource);
      }
    }
    this._fillStyle = null;
    this._strokeStyle = null;
    this.instructions = null;
    this.activePath = null;
    this._bounds = null;
    this._stateStack = null;
    this.transformMatrix = null;
    this.customShader = null;
    this._transform = null;
  }
};
let GraphicsContext = _GraphicsContext;
GraphicsContext.defaultFillStyle = {
  color: 0,
  alpha: 1,
  texture: Texture.WHITE
};
GraphicsContext.defaultStrokeStyle = {
  width: 1,
  color: 0,
  alpha: 1,
  alignment: 0.5,
  miterLimit: 10,
  cap: "butt",
  join: "miter",
  texture: Texture.WHITE
};

export { GraphicsContext };
//# sourceMappingURL=GraphicsContext.mjs.map
