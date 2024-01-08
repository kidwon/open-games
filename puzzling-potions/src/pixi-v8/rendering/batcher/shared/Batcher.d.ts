import { ViewableBuffer } from '../../../utils/ViewableBuffer';
import { TextureBatcher } from './TextureBatcher';
import type { BindGroup } from '../../renderers/gpu/shader/BindGroup';
import type { Geometry } from '../../renderers/shared/geometry/Geometry';
import type { BLEND_MODES } from '../../renderers/shared/state/const';
import type { TextureSource } from '../../renderers/shared/texture/sources/TextureSource';
import type { BindableTexture, Texture } from '../../renderers/shared/texture/Texture';
export interface TextureBatch {
    textures: BindableTexture[];
    bindGroup: BindGroup;
    batchLocations: Record<number, number>;
    size: number;
}
export declare class Batch {
    type: string;
    action: string;
    elementStart: number;
    elementSize: number;
    start: number;
    size: number;
    textures: TextureBatch;
    blendMode: BLEND_MODES;
    canBundle: boolean;
    batchParent: {
        geometry: Geometry;
        batcher: Batcher;
    };
    destroy(): void;
}
export interface BatchableObject {
    indexStart: number;
    packAttributes: (float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number) => void;
    packIndex: (indexBuffer: Uint32Array, index: number, indicesOffset: number) => void;
    texture: Texture;
    blendMode: BLEND_MODES;
    vertexSize: number;
    indexSize: number;
    textureId: number;
    location: number;
    batcher: Batcher;
    batch: Batch;
}
export declare class Batcher {
    maxSize: number;
    attributeBuffer: ViewableBuffer;
    indexBuffer: Uint32Array;
    attributeSize: number;
    indexSize: number;
    elementSize: number;
    dirty: boolean;
    batchIndex: number;
    batches: Batch[];
    vertexSize: number;
    textureBatcher: TextureBatcher;
    elements: BatchableObject[];
    updateIndex: boolean;
    currentBlendMode: BLEND_MODES;
    boundTextures: TextureSource[];
    constructor(vertexSize?: number, indexSize?: number);
    begin(): void;
    add(batchableObject: BatchableObject): void;
    checkAndUpdateTexture(batchableObject: BatchableObject, texture: Texture): boolean;
    updateElement(batchableObject: BatchableObject): void;
    hideElement(element: BatchableObject): void;
    /**
     * breaks the batcher. This happens when a batch gets too big,
     * or we need to switch to a different type of rendering (a filter for example)
     * @param hardBreak - this breaks all the batch data and stops it from trying to optimise the textures
     */
    break(hardBreak: boolean): void;
    finish(): void;
    update(): void;
    ensureAttributeBuffer(size: number): void;
    ensureIndexBuffer(size: number): void;
    private _resizeAttributeBuffer;
    private _resizeIndexBuffer;
    destroy(): void;
}
