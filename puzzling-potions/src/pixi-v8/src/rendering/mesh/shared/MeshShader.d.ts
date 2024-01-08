import { Shader } from '../../renderers/shared/shader/Shader';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { TextureShader } from './MeshView';
interface MeshShaderOptions {
    texture: Texture;
}
export declare class MeshShader extends Shader implements TextureShader {
    private _texture;
    constructor(options: MeshShaderOptions);
    get texture(): Texture;
    set texture(value: Texture);
}
export {};
