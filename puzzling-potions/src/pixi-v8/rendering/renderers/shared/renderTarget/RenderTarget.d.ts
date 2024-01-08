import { Matrix } from '../../../../maths/Matrix';
import { Rectangle } from '../../../../maths/shapes/Rectangle';
import { TextureSource } from '../texture/sources/TextureSource';
import { Texture } from '../texture/Texture';
export interface RenderTargetDescriptor {
    width?: number;
    height?: number;
    resolution?: number;
    colorTextures?: Texture[] | number;
    depthTexture?: Texture | boolean;
    stencil?: boolean;
    antialias?: boolean;
}
export declare class RenderTarget {
    static defaultDescriptor: RenderTargetDescriptor;
    uid: number;
    width: number;
    height: number;
    resolution: number;
    colorTextures: Texture[];
    depthTexture: Texture;
    clearColor: number;
    antialias: boolean;
    stencil: boolean;
    dirtyId: number;
    isRoot: boolean;
    private _viewport;
    private _projectionMatrix;
    constructor(descriptor?: RenderTargetDescriptor);
    get pixelWidth(): number;
    get pixelHeight(): number;
    get colorTexture(): Texture;
    get projectionMatrix(): Matrix;
    get viewport(): Rectangle;
    protected onSourceResize(source: TextureSource): void;
    private resize;
    destroy(): void;
}
