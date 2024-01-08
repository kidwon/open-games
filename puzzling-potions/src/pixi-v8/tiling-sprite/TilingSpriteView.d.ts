import { ObservablePoint } from '../maths/ObservablePoint';
import { Texture } from '../rendering/renderers/shared/texture/Texture';
import { Transform } from '../utils/Transform';
import type { PointData } from '../maths/PointData';
import type { View } from '../rendering/renderers/shared/View';
import type { Bounds } from '../rendering/scene/bounds/Bounds';
import type { TextureDestroyOptions, TypeOrBool } from '../rendering/scene/destroyTypes';
export interface TilingSpriteViewOptions {
    texture?: Texture;
    width?: number;
    height?: number;
    applyAnchorToTexture?: boolean;
}
export declare class TilingSpriteView implements View {
    static defaultOptions: TilingSpriteViewOptions;
    batched: boolean;
    owner: import("../rendering/renderers/shared/View").ViewObserver;
    uid: number;
    type: string;
    onRenderableUpdate: () => void;
    _bounds: [number, number, number, number];
    boundsDirty: boolean;
    anchor: ObservablePoint;
    _texture: Texture;
    tileTransform: Transform;
    applyAnchorToTexture: boolean;
    private _width;
    private _height;
    didUpdate: boolean;
    constructor(options: TilingSpriteViewOptions);
    get bounds(): [number, number, number, number];
    updateBounds(): void;
    addBounds(bounds: Bounds): void;
    set texture(value: Texture);
    get texture(): Texture;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    /**
     * @internal
     */
    onUpdate(): void;
    containsPoint(point: PointData): boolean;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions>): void;
}
