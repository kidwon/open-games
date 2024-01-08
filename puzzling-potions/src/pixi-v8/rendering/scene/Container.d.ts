import EventEmitter from 'eventemitter3';
import { Matrix } from '../../maths/Matrix';
import { ObservablePoint } from '../../maths/ObservablePoint';
import { LayerGroup } from './LayerGroup';
import type { Dict } from '../../utils/types';
import type { Renderable } from '../renderers/shared/Renderable';
import type { BLEND_MODES } from '../renderers/shared/state/const';
import type { View } from '../renderers/shared/View';
import type { DestroyOptions } from './destroyTypes';
import type { Effect } from './Effect';
export declare function getRenderableUID(): number;
export interface ContainerEvents extends PixiMixins.ContainerEvents {
    added: [container: Container];
    childAdded: [child: Container, container: Container, index: number];
    removed: [container: Container];
    childRemoved: [child: Container, container: Container, index: number];
    destroyed: [];
}
export interface ContainerOptions<T extends View> {
    label?: string;
    layer?: boolean;
    sortableChildren?: boolean;
    view?: T;
}
export declare const UPDATE_COLOR = 1;
export declare const UPDATE_BLEND = 2;
export declare const UPDATE_VISIBLE = 4;
export declare const UPDATE_TRANSFORM = 8;
export interface Container extends Omit<PixiMixins.Container, keyof EventEmitter<ContainerEvents>>, EventEmitter<ContainerEvents> {
}
export declare class Container<T extends View = View> extends EventEmitter<ContainerEvents> implements Renderable {
    /**
     * Mixes all enumerable properties and methods from a source object to Container.
     * @param source - The source of properties and methods to mix in.
     */
    static mixin(source: Dict<any>): void;
    uid: number;
    label: string;
    updateFlags: number;
    isLayerRoot: boolean;
    layerGroup: LayerGroup;
    didChange: boolean;
    didViewUpdate: boolean;
    relativeLayerDepth: number;
    children: Container[];
    parent: Container;
    includeInBuild: boolean;
    measurable: boolean;
    isSimple: boolean;
    updateTick: number;
    localTransform: Matrix;
    layerTransform: Matrix;
    _worldTransform: Matrix;
    /** The coordinate of the object relative to the local coordinates of the parent. */
    position: ObservablePoint;
    /** The scale factor of the object. */
    _scale: ObservablePoint;
    /** The pivot point of the displayObject that it rotates around. */
    _pivot: ObservablePoint;
    /** The skew amount, on the x and y axis. */
    _skew: ObservablePoint;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    _sy: number;
    /** The rotation amount. */
    _rotation: number;
    localColor: number;
    layerColor: number;
    localBlendMode: BLEND_MODES;
    layerBlendMode: BLEND_MODES;
    localVisibleRenderable: number;
    layerVisibleRenderable: number;
    effects: Effect[];
    addEffect(effect: Effect): void;
    removeEffect(effect: Effect): void;
    readonly view: T;
    constructor({ label, layer, view, sortableChildren }?: ContainerOptions<T>);
    /**
     * Adds one or more children to the container.
     *
     * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
     * @param {...PIXI.Container} children - The Container(s) to add to the container
     * @returns {PIXI.Container} - The first child that was added.
     */
    addChild<U extends Container[]>(...children: Container[]): U[0];
    /**
     * Removes one or more children from the container.
     * @param {...PIXI.Container} children - The Container(s) to remove
     * @returns {PIXI.Container} The first child that was removed.
     */
    removeChild<U extends Container[]>(...children: U): U[0];
    onUpdate(point?: ObservablePoint): void;
    onViewUpdate(): void;
    set layer(value: boolean);
    get layer(): boolean;
    enableLayer(): void;
    get worldTransform(): Matrix;
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     * An alias to position.x
     */
    get x(): number;
    set x(value: number);
    /**
     * The position of the displayObject on the y axis relative to the local coordinates of the parent.
     * An alias to position.y
     */
    get y(): number;
    set y(value: number);
    /**
     * The rotation of the object in radians.
     * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * The angle of the object in degrees.
     * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
     */
    get angle(): number;
    set angle(value: number);
    get pivot(): ObservablePoint;
    get skew(): ObservablePoint;
    get scale(): ObservablePoint;
    /** Called when the skew or the rotation changes. */
    updateSkew(): void;
    set alpha(value: number);
    get alpha(): number;
    set tint(value: number);
    get tint(): number;
    set blendMode(value: BLEND_MODES);
    get blendMode(): BLEND_MODES;
    get visible(): boolean;
    set visible(value: boolean);
    get renderable(): boolean;
    set renderable(value: boolean);
    get isRenderable(): boolean;
    updateIsSimple(): void;
    /**
     * Removes all internal references and listeners as well as removes children from the display list.
     * Do not use a Container after calling `destroy`.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
     * is set to true it should destroy the texture of the child sprite
     * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
     * If options.children is set to true it should destroy the texture source of the child sprite
     * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
     * If options.children is set to true it should destroy the context of the child graphics
     */
    destroy(options?: DestroyOptions): void;
}
