import { ExtensionType } from '../../../extensions/Extensions';
import { BufferResource } from '../shared/buffer/BufferResource';
import { BindGroup } from './shader/BindGroup';
import type { UniformGroup } from '../shared/shader/UniformGroup';
import type { WebGPURenderer } from './WebGPURenderer';
export declare class GpuUniformBatchPipe {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUPipes];
        readonly name: "uniformBatch";
    };
    private renderer;
    private bindGroupHash;
    private batchBuffer;
    private buffers;
    private bindGroups;
    private bufferResources;
    constructor(renderer: WebGPURenderer);
    renderEnd(): void;
    private resetBindGroups;
    getUniformBindGroup(group: UniformGroup<any>, duplicate: boolean): BindGroup;
    getUniformBufferResource(group: UniformGroup<any>): BufferResource;
    getArrayBindGroup(data: Float32Array): BindGroup;
    getArrayBufferResource(data: Float32Array): BufferResource;
    getBufferResource(index: number): BufferResource;
    getBindGroup(index: number): BindGroup;
    uploadBindGroups(): void;
    destroy(): void;
}
