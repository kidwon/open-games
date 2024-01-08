/// <reference types="dist" />
import type { ProgramLayout, ProgramPipelineLayoutDescription } from '../../gl/shader/GlProgram';
import type { StructsAndGroups } from './extractStructAndGroups';
export interface ProgramSource {
    source: string;
    entryPoint?: string;
}
export interface GpuProgramOptions {
    fragment?: ProgramSource;
    vertex?: ProgramSource;
    compute?: ProgramSource;
    layout?: ProgramLayout;
    gpuLayout?: ProgramPipelineLayoutDescription;
}
export interface SimpleShaderOptions {
    fragment?: string;
    vertex?: string;
}
export declare class GpuProgram {
    compute?: ProgramSource;
    fragment?: ProgramSource;
    vertex?: ProgramSource;
    layout: ProgramLayout;
    gpuLayout: ProgramPipelineLayoutDescription;
    _layoutKey: number;
    _gpuLayout: {
        bindGroups: GPUBindGroupLayout[];
        pipeline: GPUPipelineLayout | 'auto';
    };
    structsAndGroups: StructsAndGroups;
    constructor({ fragment, vertex, compute, layout, gpuLayout }: GpuProgramOptions);
    destroy(): void;
    static programCached: Record<string, GpuProgram>;
    static from(options: GpuProgramOptions): GpuProgram;
}
