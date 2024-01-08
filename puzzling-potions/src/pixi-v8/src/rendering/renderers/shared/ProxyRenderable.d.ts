import EventEmitter from 'eventemitter3';
import type { Matrix } from '../../../maths/Matrix';
import type { Renderable } from './Renderable';
import type { View } from './View';
export interface ProxyOptions<T> {
    original?: Renderable<any>;
    view: T;
}
export declare class ProxyRenderable<T extends View = View> extends EventEmitter implements Renderable<T> {
    uid: number;
    view: T;
    original: Renderable<any>;
    layerTransform: Matrix;
    worldTransform: Matrix;
    didViewUpdate: boolean;
    constructor({ original, view }: ProxyOptions<T>);
    init(original: Renderable<any>): void;
    get layerColor(): number;
    get layerBlendMode(): import("./state/const").BLEND_MODES;
    get layerVisibleRenderable(): number;
    get isRenderable(): boolean;
}
