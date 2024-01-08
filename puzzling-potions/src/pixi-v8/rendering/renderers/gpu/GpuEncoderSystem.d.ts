/// <reference types="dist" />
import { ExtensionType } from '../../../extensions/Extensions';
import type { Rectangle } from '../../../maths/shapes/Rectangle';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { Buffer } from '../shared/buffer/Buffer';
import type { Topology } from '../shared/geometry/const';
import type { Geometry } from '../shared/geometry/Geometry';
import type { RenderTarget } from '../shared/renderTarget/RenderTarget';
import type { Shader } from '../shared/shader/Shader';
import type { State } from '../shared/state/State';
import type { System } from '../shared/system/System';
import type { GPU } from './GpuDeviceSystem';
import type { GpuRenderTarget } from './renderTarget/GpuRenderTarget';
import type { BindGroup } from './shader/BindGroup';
import type { GpuProgram } from './shader/GpuProgram';
import type { WebGPURenderer } from './WebGPURenderer';
export declare class GpuEncoderSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "encoder";
    };
    commandEncoder: GPUCommandEncoder;
    renderPassEncoder: GPURenderPassEncoder;
    commandFinished: Promise<void>;
    private resolveCommandFinished;
    private gpu;
    private boundBindGroup;
    private boundVertexBuffer;
    private boundIndexBuffer;
    private boundPipeline;
    private renderer;
    constructor(renderer: WebGPURenderer);
    start(): void;
    beginRenderPass(renderTarget: RenderTarget, gpuRenderTarget: GpuRenderTarget): void;
    setViewport(viewport: Rectangle): void;
    setScissor(bounds: Bounds): void;
    clearScissor(): void;
    setPipelineFromGeometryProgramAndState(geometry: Geometry, program: GpuProgram, state: any, topology?: Topology): void;
    setPipeline(pipeline: GPURenderPipeline): void;
    setVertexBuffer(index: number, buffer: Buffer): void;
    setIndexBuffer(buffer: Buffer): void;
    setBindGroup(index: number, bindGroup: BindGroup, program: GpuProgram): void;
    setGeometry(geometry: Geometry): void;
    setShaderBindGroups(shader: Shader, skipSync?: boolean): void;
    syncBindGroup(bindGroup: BindGroup): void;
    draw(options: {
        geometry: Geometry;
        shader: Shader;
        state?: State;
        topology?: Topology;
        size?: number;
        start?: number;
        instanceCount?: number;
        skipSync?: boolean;
    }): void;
    finishRenderPass(): void;
    postrender(): void;
    restoreRenderPass(): void;
    clearCache(): void;
    destroy(): void;
    protected contextChange(gpu: GPU): void;
}
