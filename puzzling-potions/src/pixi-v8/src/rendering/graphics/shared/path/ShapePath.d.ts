import { Polygon } from '../../../../maths/shapes/Polygon';
import { Bounds } from '../../../scene/bounds/Bounds';
import type { Matrix } from '../../../../maths/Matrix';
import type { ShapePrimitive } from '../../../../maths/shapes/ShapePrimitive';
import type { GraphicsPath } from './GraphicsPath';
export declare class ShapePath {
    shapePrimitives: {
        shape: ShapePrimitive;
        transform?: Matrix;
    }[];
    currentPoly: Polygon | null;
    graphicsPath2D: GraphicsPath;
    _bounds: Bounds;
    constructor(graphicsPath2D: GraphicsPath);
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    arcToSvg(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number): this;
    closePath(): this;
    addPath(path: GraphicsPath, transform?: Matrix): this;
    finish(closePath?: boolean): void;
    rect(x: number, y: number, w: number, h: number, transform?: Matrix): this;
    circle(x: number, y: number, radius: number, transform?: Matrix): this;
    poly(points: number[], close?: boolean, transform?: Matrix): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, transform?: Matrix): this;
    roundRect(x: number, y: number, w: number, h: number, radii?: number, transform?: Matrix): this;
    drawShape(shape: ShapePrimitive, matrix?: Matrix): this;
    startPoly(x: number, y: number): this;
    endPoly(closePath?: boolean): this;
    private _ensurePoly;
    buildPath(): void;
    isPointInPath(x: number, y: number): boolean;
    get bounds(): Bounds;
}
