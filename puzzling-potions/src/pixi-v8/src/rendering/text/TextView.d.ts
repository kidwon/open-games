import { ObservablePoint } from '../../maths/ObservablePoint';
import { TextStyle } from './TextStyle';
import type { PointData } from '../../maths/PointData';
import type { View } from '../renderers/shared/View';
import type { Bounds } from '../scene/bounds/Bounds';
import type { TextureDestroyOptions, TypeOrBool } from '../scene/destroyTypes';
import type { TextStyleOptions } from './TextStyle';
type Filter<T> = {
    [K in keyof T]: {
        text?: TextString;
        renderMode?: K;
        resolution?: number;
        style?: T[K];
    };
}[keyof T];
export type TextStyles = {
    canvas: TextStyleOptions | TextStyle;
    bitmap: TextStyleOptions | TextStyle;
};
export type TextViewOptions = Filter<TextStyles>;
export type TextString = string | number | {
    toString: () => string;
};
export declare class TextView implements View {
    static defaultResolution: number;
    static defaultAutoResolution: boolean;
    uid: number;
    batched: boolean;
    type: string;
    owner: import("../renderers/shared/View").ViewObserver;
    _bounds: [number, number, number, number];
    boundsDirty: boolean;
    anchor: ObservablePoint;
    _autoResolution: boolean;
    _resolution: number;
    readonly renderMode: 'canvas' | 'html' | 'bitmap';
    _style: TextStyle;
    private _text;
    didUpdate: boolean;
    constructor(options: TextViewOptions);
    set text(value: TextString);
    get text(): string;
    get style(): TextStyle;
    set style(style: TextStyle | Partial<TextStyle>);
    set resolution(value: number);
    get resolution(): number;
    get bounds(): [number, number, number, number];
    updateBounds(): void;
    addBounds(bounds: Bounds): void;
    /**
     * @internal
     */
    onUpdate(): void;
    _getKey(): string;
    containsPoint(point: PointData): boolean;
    detectRenderType(style: TextStyle): 'canvas' | 'html' | 'bitmap';
    /**
     * Destroys this text renderable and optionally its style texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions>): void;
}
export {};
