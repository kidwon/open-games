import { ObservablePoint } from '../../../maths/ObservablePoint';
import type { PointData } from '../../../maths/PointData';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { View } from '../../renderers/shared/View';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { TextureDestroyOptions, TypeOrBool } from '../../scene/destroyTypes';
export declare class SpriteView implements View {
    owner: import("../../renderers/shared/View").ViewObserver;
    _texture: Texture;
    anchor: ObservablePoint;
    batched: boolean;
    buildId: number;
    uid: number;
    type: string;
    _bounds: [number, number, number, number];
    _sourceBounds: [number, number, number, number];
    boundsDirty: boolean;
    sourceBoundsDirty: boolean;
    didUpdate: boolean;
    constructor(texture: Texture);
    set texture(value: Texture);
    get texture(): Texture;
    get bounds(): [number, number, number, number];
    get sourceBounds(): [number, number, number, number];
    updateBounds(): void;
    private _updateSourceBounds;
    addBounds(bounds: Bounds): void;
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
