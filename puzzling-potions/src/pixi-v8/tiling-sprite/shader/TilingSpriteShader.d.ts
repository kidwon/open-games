import { Shader } from '../../rendering/renderers/shared/shader/Shader';
import type { TextureShader } from '../../rendering/mesh/shared/MeshView';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
interface TilingSpriteOptions {
    texture: Texture;
}
export declare class TilingSpriteShader extends Shader implements TextureShader {
    private _texture;
    constructor(options: TilingSpriteOptions);
    get texture(): Texture;
    set texture(value: Texture);
}
export {};
