import { Container } from '../rendering/scene/Container';
import { TilingSpriteView } from './TilingSpriteView';
import type { ContainerOptions } from '../rendering/scene/Container';
import type { TilingSpriteViewOptions } from './TilingSpriteView';
export type TilingSpriteOptions = TilingSpriteViewOptions & ContainerOptions<TilingSpriteView>;
export declare class TilingSprite extends Container<TilingSpriteView> {
    constructor(options?: TilingSpriteOptions);
    set texture(value: import("..").Texture);
    get texture(): import("..").Texture;
    get anchor(): import("..").ObservablePoint;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get tilePosition(): import("..").ObservablePoint;
    set tilePosition(value: import("..").ObservablePoint);
    get tileScale(): import("..").ObservablePoint;
    set tileScale(value: import("..").ObservablePoint);
    set tileRotation(value: number);
    get tileRotation(): number;
    get tileTransform(): import("..").Transform;
}
