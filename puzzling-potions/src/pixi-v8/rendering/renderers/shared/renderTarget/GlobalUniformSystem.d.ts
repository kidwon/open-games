import { ExtensionType } from '../../../../extensions/Extensions';
import { Matrix } from '../../../../maths/Matrix';
import { BindGroup } from '../../gpu/shader/BindGroup';
import { UniformGroup } from '../shader/UniformGroup';
import type { PointData } from '../../../../maths/PointData';
import type { GlRenderTargetSystem } from '../../gl/GlRenderTargetSystem';
import type { GpuRenderTargetSystem } from '../../gpu/renderTarget/GpuRenderTargetSystem';
import type { Renderer } from '../../types';
import type { UniformBufferSystem } from '../shader/UniformBufferSystem';
import type { System } from '../system/System';
export type GlobalUniformGroup = UniformGroup<{
    projectionMatrix: {
        value: Matrix;
        type: 'mat3x3<f32>';
    };
    worldTransformMatrix: {
        value: Matrix;
        type: 'mat3x3<f32>';
    };
    worldAlpha: {
        value: number;
        type: 'f32';
    };
}>;
export interface GlobalUniformOptions {
    projectionMatrix?: Matrix;
    worldTransformMatrix?: Matrix;
    worldColor?: number;
    offset?: PointData;
}
export interface GlobalUniformData {
    projectionMatrix: Matrix;
    worldTransformMatrix: Matrix;
    worldColor: number;
    offset: PointData;
    bindGroup: BindGroup;
}
interface GlobalUniformRenderer {
    renderTarget: GlRenderTargetSystem | GpuRenderTargetSystem;
    renderPipes: Renderer['renderPipes'];
    uniformBuffer: UniformBufferSystem;
}
export declare class GlobalUniformSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "globalUniforms";
    };
    private renderer;
    private stackIndex;
    private globalUniformDataStack;
    private uniformsPool;
    private activeUniforms;
    private bindGroupPool;
    private activeBindGroups;
    private currentGlobalUniformData;
    constructor(renderer: GlobalUniformRenderer);
    reset(): void;
    start(options: GlobalUniformOptions): void;
    bind({ projectionMatrix, worldTransformMatrix, worldColor, offset, }: GlobalUniformOptions): void;
    push(options: GlobalUniformOptions): void;
    pop(): void;
    get bindGroup(): BindGroup;
    get uniformGroup(): UniformGroup<any>;
    private createUniforms;
    destroy(): void;
}
export {};
