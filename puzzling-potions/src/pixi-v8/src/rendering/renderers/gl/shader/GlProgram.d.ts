/// <reference types="dist" />
import type { TypedArray } from '../../shared/buffer/Buffer';
export type ProgramPipelineLayoutDescription = GPUBindGroupLayoutEntry[][];
export type ProgramLayout = Record<string, number>[];
export interface IAttributeData {
    type: string;
    size: number;
    location: number;
    name: string;
}
export interface IUniformData {
    name: string;
    index: number;
    type: string;
    size: number;
    isArray: boolean;
    value: any;
}
export interface IUniformBlockData {
    index: number;
    name: string;
    size: number;
    value?: TypedArray;
}
export interface GlProgramOptions {
    fragment?: string;
    vertex?: string;
    name?: string;
}
export declare class GlProgram {
    fragment?: string;
    vertex?: string;
    attributeData: Record<string, IAttributeData>;
    uniformData: Record<string, IUniformData>;
    uniformBlockData: Record<string, IUniformBlockData>;
    transformFeedbackVaryings?: {
        names: string[];
        bufferMode: 'separate' | 'interleaved';
    };
    readonly key: string;
    constructor({ fragment, vertex, name }: GlProgramOptions);
    destroy(): void;
    static programCached: Record<string, GlProgram>;
    static from(options: GlProgramOptions): GlProgram;
}
