import { ExtensionType } from '../../../../extensions/Extensions';
import type { Shader } from '../../shared/shader/Shader';
import type { System } from '../../shared/system/System';
import type { GPU } from '../GpuDeviceSystem';
import type { WebGPURenderer } from '../WebGPURenderer';
import type { GpuProgram } from './GpuProgram';
export declare class GpuShaderSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "shader";
    };
    private readonly renderer;
    private gpu;
    constructor(renderer: WebGPURenderer);
    protected contextChange(gpu: GPU): void;
    createProgramLayout(program: GpuProgram): void;
    updateData(shader: Shader): void;
    destroy(): void;
}
