import { MeshView } from '../rendering/mesh/shared/MeshView';
import { Texture } from '../rendering/renderers/shared/texture/Texture';
import { Container } from '../rendering/scene/Container';
import { NineSliceGeometry } from './NineSliceGeometry';
import type { ContainerOptions } from '../rendering/scene/Container';
export interface NineSliceSpriteOptions extends ContainerOptions<MeshView<NineSliceGeometry>> {
    texture: Texture;
    leftWidth?: number;
    topHeight?: number;
    rightWidth?: number;
    bottomHeight?: number;
}
/**
 * The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
 * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
 *
 * <pre>
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+
 *  When changing this objects width and/or height:
 *     areas 1 3 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 * </pre>
 * @example
 * import { NineSlicePlane, Texture } from 'pixi.js';
 *
 * const plane9 = new NineSlicePlane(Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
 * @memberof PIXI
 */
export declare class NineSliceSprite extends Container<MeshView<NineSliceGeometry>> {
    static defaultOptions: NineSliceSpriteOptions;
    /**
     * @param options - Options to use
     * @param options.texture - The texture to use on the NineSlicePlane.
     * @param options.leftWidth - Width of the left vertical bar (A)
     * @param options.topHeight - Height of the top horizontal bar (C)
     * @param options.rightWidth - Width of the right vertical bar (B)
     * @param options.bottomHeight - Height of the bottom horizontal bar (D)
     * @param options.width - Width of the NineSlicePlane,
     * setting this will actually modify the vertices and not the UV's of this plane.
     * @param options.height - Height of the NineSlicePlane,
     * setting this will actually modify the vertices and not UV's of this plane.
     */
    constructor(options: NineSliceSpriteOptions | Texture);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get leftWidth(): number;
    set leftWidth(value: number);
    get topHeight(): number;
    set topHeight(value: number);
    get rightWidth(): number;
    set rightWidth(value: number);
    get bottomHeight(): number;
    set bottomHeight(value: number);
    get texture(): Texture;
    set texture(value: Texture);
}
export declare class NineSlicePlane extends NineSliceSprite {
    constructor(options: NineSliceSpriteOptions | Texture);
}
