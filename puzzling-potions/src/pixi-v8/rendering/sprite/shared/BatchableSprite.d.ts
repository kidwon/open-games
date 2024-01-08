import type { Batch, BatchableObject, Batcher } from '../../batcher/shared/Batcher';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { View } from '../../renderers/shared/View';
export declare class BatchableSprite implements BatchableObject {
    visible: boolean;
    indexStart: number;
    sprite: Renderable<View>;
    vertexSize: number;
    indexSize: number;
    texture: Texture;
    textureId: number;
    location: number;
    batcher: Batcher;
    batch: Batch;
    bounds: [number, number, number, number];
    get blendMode(): import("../../..").BLEND_MODES;
    packAttributes(float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number): void;
    packIndex(indexBuffer: Uint32Array, index: number, indicesOffset: number): void;
    reset(): void;
}
