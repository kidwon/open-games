import { ExtensionType } from '../../../extensions/Extensions';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../renderers/types';
import type { Container } from '../../scene/Container';
import type { ColorMask } from './ColorMask';
export interface ColorMaskInstruction extends Instruction {
    type: 'colorMask';
    colorMask: number;
}
export declare class ColorMaskPipe implements InstructionPipe<ColorMaskInstruction> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "colorMask";
    };
    private renderer;
    private colorStack;
    private colorStackIndex;
    private currentColor;
    constructor(renderer: Renderer);
    buildStart(): void;
    push(mask: ColorMask, _container: Container, instructionSet: InstructionSet): void;
    pop(_mask: ColorMask, _container: Container, instructionSet: InstructionSet): void;
    execute(instruction: ColorMaskInstruction): void;
    destroy(): void;
}
