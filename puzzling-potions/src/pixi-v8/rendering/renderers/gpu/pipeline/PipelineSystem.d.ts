/// <reference types="dist" />
import { ExtensionType } from '../../../../extensions/Extensions';
import { STENCIL_MODES } from '../../shared/state/const';
import type { Topology } from '../../shared/geometry/const';
import type { Geometry } from '../../shared/geometry/Geometry';
import type { State } from '../../shared/state/State';
import type { System } from '../../shared/system/System';
import type { GPU } from '../GpuDeviceSystem';
import type { GpuProgram } from '../shader/GpuProgram';
import type { WebGPURenderer } from '../WebGPURenderer';
export declare class PipelineSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "pipeline";
    };
    readonly renderer: WebGPURenderer;
    protected CONTEXT_UID: number;
    private _moduleCache;
    private _bufferLayoutsCache;
    private _pipeCache;
    private gpu;
    private stencilState;
    private stencilMode;
    private colorMask;
    private multisampleCount;
    constructor(renderer: WebGPURenderer);
    protected contextChange(gpu: GPU): void;
    setMultisampleCount(multisampleCount: number): void;
    setColorMask(colorMask: number): void;
    setStencilMode(stencilMode: STENCIL_MODES): void;
    setPipeline(geometry: Geometry, program: GpuProgram, state: State, passEncoder: GPURenderPassEncoder): void;
    getPipeline(geometry: Geometry, program: GpuProgram, state: State, topology?: Topology): GPURenderPipeline;
    private createPipeline;
    private getModule;
    private createModule;
    private generateProgramKey;
    private generateBufferKey;
    private createVertexBufferLayouts;
    destroy(): void;
}
