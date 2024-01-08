import { ExtensionType } from '../../../extensions/Extensions';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../renderers/types';
import type { Container } from '../../scene/Container';
import type { FilterEffect } from '../FilterEffect';
import type { FilterInstruction } from './FilterSystem';
export declare class FilterPipe implements InstructionPipe<FilterInstruction> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "filter";
    };
    renderer: Renderer;
    filterGlobalUniforms: UniformGroup<{
        inputSize: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        inputPixel: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        inputClamp: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        outputFrame: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        backgroundFrame: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        globalFrame: {
            value: Float32Array;
            type: "vec4<f32>";
        };
    }>;
    constructor(renderer: Renderer);
    push(filterEffect: FilterEffect, container: Container, instructionSet: InstructionSet): void;
    pop(_filterEffect: FilterEffect, _container: Container, instructionSet: InstructionSet): void;
    execute(instruction: FilterInstruction): void;
    destroy(): void;
}
