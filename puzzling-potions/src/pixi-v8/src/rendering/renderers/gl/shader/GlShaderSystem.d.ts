import { ExtensionType } from '../../../../extensions/Extensions';
import { BufferResource } from '../../shared/buffer/BufferResource';
import { UniformGroup } from '../../shared/shader/UniformGroup';
import type { Shader } from '../../shared/shader/Shader';
import type { GlRenderingContext } from '../context/GlRenderingContext';
import type { WebGLRenderer } from '../WebGLRenderer';
import type { GlProgram } from './GlProgram';
import type { GlProgramData } from './GlProgramData';
export declare class GlShaderSystem {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "shader";
    };
    programDataHash: Record<string, GlProgramData>;
    renderer: WebGLRenderer;
    gl: WebGL2RenderingContext;
    activeProgram: GlProgram;
    maxBindings: number;
    nextIndex: number;
    boundUniformsIdsToIndexHash: Record<number, number>;
    boundIndexToUniformsHash: Record<number, UniformGroup | BufferResource>;
    constructor(renderer: WebGLRenderer);
    contextChange(gl: GlRenderingContext): void;
    bind(shader: Shader, skipSync?: boolean): void;
    updateUniformGroup(uniformGroup: UniformGroup): void;
    bindUniformBlock(uniformGroup: UniformGroup | BufferResource, name: string, index?: number): void;
    setProgram(program: GlProgram): void;
    getProgramData(program: GlProgram): GlProgramData;
    createProgramData(program: GlProgram): GlProgramData;
}
