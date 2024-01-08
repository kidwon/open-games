import EventEmitter from 'eventemitter3';
import { BindGroup } from '../../gpu/shader/BindGroup';
import type { GlProgram } from '../../gl/shader/GlProgram';
import type { GpuProgram } from '../../gpu/shader/GpuProgram';
export type ShaderGroups = Record<number, BindGroup>;
export interface ShaderWithGroupsDescriptor {
    glProgram?: GlProgram;
    gpuProgram?: GpuProgram;
    groups: ShaderGroups;
    groupMap?: Record<string, Record<string, any>>;
}
export interface ShaderWithResourcesDescriptor {
    glProgram?: GlProgram;
    gpuProgram?: GpuProgram;
    resources: Record<string, any>;
}
export declare class Shader extends EventEmitter<{
    'destroy': Shader;
}> {
    gpuProgram: GpuProgram;
    glProgram: GlProgram;
    groups: Record<number, BindGroup>;
    resources: Record<string, any>;
    uniformBindMap: Record<number, Record<number, string>>;
    constructor({ gpuProgram, glProgram, resources }: ShaderWithResourcesDescriptor);
    constructor({ gpuProgram, glProgram, groups, groupMap }: ShaderWithGroupsDescriptor);
    private _buildResourceAccessor;
    destroy(destroyProgram?: boolean): void;
}
