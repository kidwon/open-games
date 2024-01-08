import { Texture } from '../../renderers/shared/texture/Texture';
import { Container } from '../../scene/Container';
import { SpriteView } from './SpriteView';
import type { ContainerOptions } from '../../scene/Container';
export interface SpriteOptions extends ContainerOptions<SpriteView> {
    texture?: Texture;
}
export declare class Sprite extends Container<SpriteView> {
    static from(id: Texture | string): Sprite;
    constructor(options?: SpriteOptions | Texture);
    get anchor(): import("../../..").ObservablePoint;
    get texture(): Texture;
    set texture(value: Texture);
}
