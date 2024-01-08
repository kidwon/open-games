/// <reference types="dist" />
import { GpuProgram } from '../../renderers/gpu/shader/GpuProgram';
import type { ProgramSource } from '../../renderers/gpu/shader/GpuProgram';
export declare function generateBatchProgram({ vertex, fragment, maxTextures }: {
    vertex: ProgramSource;
    fragment: ProgramSource;
    maxTextures: number;
}): GpuProgram;
export declare function generateLayout(maxTextures: number): Record<string, number>;
export declare function generateGPULayout(maxTextures: number): GPUBindGroupLayoutEntry[];
export declare function generateSampleSrc(maxTextures: number): string;
export declare function generateBindingSrc(maxTextures: number): string;
