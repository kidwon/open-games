import EventEmitter from 'eventemitter3';
import { Matrix } from '../../../maths/Matrix';
import { Texture } from '../../renderers/shared/texture/Texture';
import { Bounds } from '../../scene/bounds/Bounds';
import { FillGradient } from './fill/FillGradient';
import { FillPattern } from './fill/FillPattern';
import { GraphicsPath } from './path/GraphicsPath';
import type { PointData } from '../../../maths/PointData';
import type { Shader } from '../../renderers/shared/shader/Shader';
import type { TextureDestroyOptions, TypeOrBool } from '../../scene/destroyTypes';
import type { LineCap, LineJoin } from './const';
export interface FillStyle {
    color?: number;
    alpha?: number;
    texture?: Texture;
    matrix?: Matrix;
    fill?: FillPattern | FillGradient;
}
export interface PatternFillStyle {
    fill?: FillPattern;
    color?: number;
    alpha?: number;
}
export interface DefaultFillStyle {
    color?: number;
    alpha?: number;
    texture?: Texture;
    matrix?: Matrix;
}
export interface StrokeStyle extends FillStyle {
    width?: number;
    alignment?: number;
    cap?: LineCap;
    join?: LineJoin;
    miterLimit?: number;
}
export type BatchMode = 'auto' | 'batch' | 'no-batch';
export type FillStyleInputs = number | string | FillGradient | CanvasPattern | PatternFillStyle | DefaultFillStyle;
export interface FillInstruction {
    action: 'fill' | 'stroke' | 'cut';
    data: {
        style: FillStyle;
        path: GraphicsPath;
        hole?: GraphicsPath;
    };
}
export interface TextureInstruction {
    action: 'texture';
    data: {
        image: Texture;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
        transform: Matrix;
        alpha: number;
        style: number;
    };
}
export type GraphicsInstructions = FillInstruction | TextureInstruction;
export declare class GraphicsContext extends EventEmitter<{
    update: GraphicsContext;
    destroy: GraphicsContext;
}> {
    static defaultFillStyle: FillStyle;
    static defaultStrokeStyle: StrokeStyle;
    uid: number;
    usage: number;
    dirty: boolean;
    batchMode: BatchMode;
    transformMatrix: Matrix;
    instructions: GraphicsInstructions[];
    activePath: GraphicsPath;
    customShader?: Shader;
    private _transform;
    private _fillStyle;
    private _fillStyleOriginal;
    private _strokeStyle;
    private _strokeStyleOriginal;
    private _stateStack;
    private _tick;
    private _bounds;
    private boundsDirty;
    set fillStyle(value: FillStyleInputs);
    get fillStyle(): FillStyleInputs;
    set strokeStyle(value: FillStyleInputs);
    get strokeStyle(): FillStyleInputs;
    setFillStyle(style: FillStyleInputs): this;
    setStrokeStyle(style: FillStyleInputs): this;
    texture(texture: Texture): this;
    texture(texture: Texture, tint: number): this;
    texture(texture: Texture, tint: number, dx: number, dy: number): this;
    texture(texture: Texture, tint: number, dx: number, dy: number, dw: number, dh: number): this;
    beginPath(): this;
    fill(style?: FillStyleInputs): this;
    stroke(style?: FillStyleInputs): this;
    cut(): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    arcToSvg(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    closePath(): this;
    ellipse(x: number, y: number, radiusX: number, radiusY: number): this;
    circle(x: number, y: number, radius: number): this;
    path(path: GraphicsPath): this;
    lineTo(x: number, y: number): this;
    moveTo(x: number, y: number): this;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): this;
    roundRect(x: number, y: number, w: number, h: number, radii?: number): this;
    poly(points: number[], close?: boolean): this;
    star(x: number, y: number, points: number, radius: number, innerRadius: number, rotation: number): this;
    svg(svg: string): void;
    restore(): void;
    save(): void;
    getTransform(): Matrix;
    resetTransform(): this;
    rotate(angle: number): this;
    scale(x: number, y?: number): this;
    setTransform(transform: Matrix): this;
    setTransform(a: number, b: number, c: number, d: number, dx: number, dy: number): this;
    transform(transform: Matrix): this;
    transform(a: number, b: number, c: number, d: number, dx: number, dy: number): this;
    translate(x: number, y: number): this;
    clear(): this;
    onUpdate(): void;
    get bounds(): Bounds;
    /**
     * Check to see if a point is contained within this geometry.
     * @param point - Point to check if it's contained.
     * @returns {boolean} `true` if the point is contained within geometry.
     */
    containsPoint(point: PointData): boolean;
    private _forEachShape;
    /**
     * Destroys the GraphicsData object.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the fill/stroke style?
     * @param {boolean} [options.textureSource=false] - Should it destroy the texture source of the fill/stroke style?
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions>): void;
}
