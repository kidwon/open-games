/// <reference types="dist" />
import { ExtensionType } from '../../../../extensions/Extensions';
import type { Buffer } from '../../shared/buffer/Buffer';
import type { System } from '../../shared/system/System';
import type { GPU } from '../GpuDeviceSystem';
import type { WebGPURenderer } from '../WebGPURenderer';
export declare class BufferSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "buffer";
    };
    readonly renderer: WebGPURenderer;
    protected CONTEXT_UID: number;
    private _gpuBuffers;
    private gpu;
    protected contextChange(gpu: GPU): void;
    getGPUBuffer(buffer: Buffer): GPUBuffer;
    updateBuffer(buffer: Buffer): GPUBuffer;
    /** dispose all WebGL resources of all managed buffers */
    destroyAll(): void;
    createGPUBuffer(buffer: Buffer): GPUBuffer;
    protected onBufferChange(buffer: Buffer): void;
    /**
     * Disposes buffer
     * @param buffer - buffer with data
     */
    onBufferDestroy(buffer: Buffer): void;
    destroy(): void;
}
