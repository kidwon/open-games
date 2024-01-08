import { Point } from '../../../../maths/Point';
import { ShapePath } from './ShapePath';
import type { Matrix } from '../../../../maths/Matrix';
import type { Bounds } from '../../../scene/bounds/Bounds';
export interface PathInstruction {
    action: 'moveTo' | 'lineTo' | 'quadraticCurveTo' | 'bezierCurveTo' | 'arc' | 'closePath' | 'addPath' | 'arcTo' | 'ellipse' | 'rect' | 'roundRect' | 'arcToSvg' | 'poly' | 'circle';
    data: any[];
}
export declare class GraphicsPath {
    instructions: PathInstruction[];
    uid: number;
    dirty: boolean;
    _shapePath: ShapePath;
    get shapePath(): ShapePath;
    constructor(instructions?: string | PathInstruction[]);
    addPath(path: GraphicsPath, transform?: Matrix): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    arcToSvg(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    bezierCurveToShort(cp2x: number, cp2y: number, x: number, y: number): this;
    closePath(): this;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, matrix?: Matrix): this;
    lineTo(x: number, y: number): this;
    moveTo(x: number, y: number): this;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;
    quadraticCurveToShort(x: number, y: number): this;
    rect(x: number, y: number, w: number, h: number, transform?: Matrix): this;
    circle(x: number, y: number, radius: number, transform?: Matrix): this;
    roundRect(x: number, y: number, w: number, h: number, radii?: number, transform?: Matrix): this;
    poly(points: number[], close?: boolean, transform?: Matrix): this;
    star(x: number, y: number, points: number, radius: number, innerRadius?: number, rotation?: number, transform?: Matrix): this;
    clone(deep?: boolean): GraphicsPath;
    getLastPoint(out: Point): Point;
    clear(): this;
    transform(matrix: Matrix): this;
    get bounds(): Bounds;
}
