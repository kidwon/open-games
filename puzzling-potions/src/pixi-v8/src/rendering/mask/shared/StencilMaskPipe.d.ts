import { ExtensionType } from '../../../extensions/Extensions';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../renderers/types';
import type { Container } from '../../scene/Container';
import type { StencilMask } from './StencilMask';
type MaskMode = 'pushMaskBegin' | 'pushMaskEnd' | 'popMaskBegin' | 'popMaskEnd';
export interface StencilMaskInstruction extends Instruction {
    type: 'stencilMask';
    action: MaskMode;
    mask: StencilMask;
}
export declare class StencilMaskPipe implements InstructionPipe<StencilMaskInstruction> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "stencilMask";
    };
    private renderer;
    private maskStackHash;
    private maskHash;
    constructor(renderer: Renderer);
    push(mask: StencilMask, _container: Container, instructionSet: InstructionSet): void;
    pop(mask: StencilMask, _container: Container, instructionSet: InstructionSet): void;
    execute(instruction: StencilMaskInstruction): void;
    destroy(): void;
}
export {};
