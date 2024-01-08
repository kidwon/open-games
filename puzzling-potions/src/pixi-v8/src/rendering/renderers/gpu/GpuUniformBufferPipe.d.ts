import { ExtensionType } from '../../../extensions/Extensions';
import { Buffer } from '../shared/buffer/Buffer';
import { BindGroup } from './shader/BindGroup';
import type { UniformGroup } from '../shared/shader/UniformGroup';
import type { WebGPURenderer } from './WebGPURenderer';
declare class UniformBindGroup extends BindGroup {
    constructor();
    get buffer(): Buffer;
    get data(): Float32Array;
}
export declare class GpuUniformBufferPipe {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUPipes];
        readonly name: "uniformBuffer";
    };
    private activeBindGroups;
    private activeBindGroupIndex;
    private renderer;
    constructor(renderer: WebGPURenderer);
    getUniformBindGroup(uniformGroup: UniformGroup): UniformBindGroup;
    renderEnd(): void;
}
export {};
