import type { PointData } from '../../../maths/PointData';
import type { Shader } from '../../renderers/shared/shader/Shader';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { View } from '../../renderers/shared/View';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { DestroyOptions } from '../../scene/destroyTypes';
import type { MeshGeometry } from './MeshGeometry';
export interface TextureShader extends Shader {
    texture: Texture;
}
export interface MeshViewTextureOptions {
    geometry: MeshGeometry;
    texture: Texture;
}
export interface MeshViewShaderOptions {
    geometry: MeshGeometry;
    shader: TextureShader;
}
export type MeshViewOptions = MeshViewTextureOptions | MeshViewShaderOptions;
export declare class MeshView<GEOMETRY extends MeshGeometry = MeshGeometry> implements View {
    uid: number;
    type: string;
    _texture: Texture;
    _geometry: GEOMETRY;
    _shader?: TextureShader;
    canBundle: boolean;
    action?: string;
    owner: import("../../renderers/shared/View").ViewObserver;
    constructor(options: MeshViewOptions);
    set shader(value: TextureShader);
    get shader(): TextureShader;
    set geometry(value: GEOMETRY);
    get geometry(): GEOMETRY;
    set texture(value: Texture);
    get texture(): Texture;
    addBounds(bounds: Bounds): void;
    containsPoint(point: PointData): boolean;
    get batched(): boolean;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: DestroyOptions): void;
    protected onGeometryUpdate(): void;
    protected onUpdate(): void;
}
