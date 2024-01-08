import EventEmitter from 'eventemitter3';
import { Matrix } from '../../../maths/Matrix';
import type { Container } from '../../scene/Container';
import type { Renderable } from './Renderable';
import type { View } from './View';
/**
 * LayerRenderable is used to render the view of the root container of a layer group
 * We don't want to inherit the transform / color of the root container as that information is
 * uploaded to the GPU and applied globally.
 *
 * This proxy allows us to override the values. This saves us a lot of extra if statements in the core loop
 * for what is normally a very rare use case!
 */
export declare class LayerRenderable<T extends View = View> extends EventEmitter implements Renderable<T> {
    uid: number;
    view: T;
    original: Container<View>;
    layerTransform: Matrix;
    worldTransform: Matrix;
    layerColor: number;
    layerVisibleRenderable: number;
    didViewUpdate: boolean;
    constructor({ original, view }: {
        original: Container<View>;
        view: T;
    });
    get layerBlendMode(): import("./state/const").BLEND_MODES;
    onViewUpdate(): void;
    get isRenderable(): boolean;
}
