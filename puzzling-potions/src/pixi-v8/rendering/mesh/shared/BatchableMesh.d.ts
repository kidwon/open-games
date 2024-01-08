import type { Batch, BatchableObject, Batcher } from '../../batcher/shared/Batcher';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { MeshView } from './MeshView';
export declare class BatchableMesh implements BatchableObject {
    indexStart: number;
    textureId: number;
    texture: Texture;
    location: number;
    batcher: Batcher;
    batch: Batch;
    renderable: Renderable<MeshView>;
    get blendMode(): import("../../..").BLEND_MODES;
    reset(): void;
    packIndex(indexBuffer: Uint32Array, index: number, indicesOffset: number): void;
    packAttributes(float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number): void;
    get vertexSize(): number;
    get indexSize(): number;
}
