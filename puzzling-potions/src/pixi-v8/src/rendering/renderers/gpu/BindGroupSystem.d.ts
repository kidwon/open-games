/// <reference types="dist" />
import { ExtensionType } from '../../../extensions/Extensions';
import type { System } from '../shared/system/System';
import type { GPU } from './GpuDeviceSystem';
import type { BindGroup } from './shader/BindGroup';
import type { GpuProgram } from './shader/GpuProgram';
import type { WebGPURenderer } from './WebGPURenderer';
export declare class BindGroupSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "bindGroup";
    };
    private readonly renderer;
    private hash;
    private gpu;
    constructor(renderer: WebGPURenderer);
    protected contextChange(gpu: GPU): void;
    getBindGroup(bindGroup: BindGroup, program: GpuProgram, groupIndex: number): GPUBindGroup;
    private createBindGroup;
    destroy(): void;
}
