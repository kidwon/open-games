import type { ExtensionMetadata } from '../../../extensions/Extensions';
import type { WebGPURenderer } from '../../renderers/gpu/WebGPURenderer';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Container } from '../../scene/Container';
import type { ScissorMask } from '../shared/ScissorMask';
type MaskMode = 'pushMaskBegin' | 'pushMaskEnd' | 'popMaskBegin' | 'popMaskEnd';
export interface ScissorMaskInstruction extends Instruction {
    type: 'scissorMask';
    action: MaskMode;
    mask: ScissorMask;
}
export declare class GpuScissorMaskPipe implements InstructionPipe<ScissorMaskInstruction> {
    /** @ignore */
    static extension: ExtensionMetadata;
    private renderer;
    constructor(renderer: WebGPURenderer);
    push(mask: ScissorMask, _container: Container, instructionSet: InstructionSet): void;
    pop(_mask: ScissorMask, _container: Container, instructionSet: InstructionSet): void;
    execute(instruction: ScissorMaskInstruction): void;
}
export {};
