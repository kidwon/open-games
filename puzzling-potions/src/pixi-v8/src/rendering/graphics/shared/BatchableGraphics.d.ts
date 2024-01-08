import type { Batch, BatchableObject, Batcher } from '../../batcher/shared/Batcher';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { GraphicsView } from './GraphicsView';
export declare class BatchableGraphics implements BatchableObject {
    indexStart: number;
    textureId: number;
    texture: Texture;
    location: number;
    batcher: Batcher;
    batch: Batch;
    renderable: Renderable<GraphicsView>;
    indexOffset: number;
    indexSize: number;
    vertexOffset: number;
    vertexSize: number;
    color: number;
    alpha: number;
    colorAlpha: number;
    applyTransform: boolean;
    geometryData: {
        vertices: number[];
        uvs: number[];
        indices: number[];
    };
    get blendMode(): import("../../..").BLEND_MODES;
    packIndex(indexBuffer: Uint32Array, index: number, indicesOffset: number): void;
    packAttributes(float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number): void;
    get vertSize(): number;
    copyTo(gpuBuffer: BatchableGraphics): void;
}
