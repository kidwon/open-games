import type { BindGroup } from '../../renderers/gpu/shader/BindGroup';
import type { TextureSource } from '../../renderers/shared/texture/sources/TextureSource';
import type { BindableTexture } from '../../renderers/shared/texture/Texture';
import type { TextureBatch } from './Batcher';
export declare class TextureBatchOutput implements TextureBatch {
    textures: TextureSource[];
    bindGroup: BindGroup;
    size: number;
    batchLocations: Record<number, number>;
}
export declare class TextureBatcher {
    textureTicks: Record<number, number>;
    tick: number;
    output: TextureBatch;
    bindingOffset: number;
    begin(): void;
    reset(): void;
    finish(previousBatch?: TextureBatch): TextureBatch;
    add(texture: BindableTexture): boolean;
    destroy(): void;
}
