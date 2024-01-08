import { ExtensionType } from '../../../extensions/Extensions';
import type { Renderer } from '../types';
import type { Instruction } from './instructions/Instruction';
import type { InstructionSet } from './instructions/InstructionSet';
import type { InstructionPipe } from './instructions/RenderPipe';
import type { Renderable } from './Renderable';
import type { BLEND_MODES } from './state/const';
export interface AdvancedBlendInstruction extends Instruction {
    type: 'blendMode';
    blendMode: BLEND_MODES;
    activeBlend: Renderable[];
}
export declare class BlendModePipe implements InstructionPipe<AdvancedBlendInstruction> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "blendMode";
    };
    private renderer;
    private renderableList;
    private activeBlendMode;
    private isAdvanced;
    private filterHash;
    constructor(renderer: Renderer);
    setBlendMode(renderable: Renderable, blendMode: BLEND_MODES, instructionSet: InstructionSet): void;
    private beginAdvancedBlendMode;
    private endAdvancedBlendMode;
    buildStart(): void;
    buildEnd(instructionSet: InstructionSet): void;
    destroy(): void;
}
