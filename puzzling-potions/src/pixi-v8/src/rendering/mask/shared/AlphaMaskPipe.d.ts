import { ExtensionType } from '../../../extensions/Extensions';
import { FilterEffect } from '../../filters/FilterEffect';
import { Texture } from '../../renderers/shared/texture/Texture';
import { Sprite } from '../../sprite/shared/Sprite';
import type { PoolItem } from '../../../utils/pool/Pool';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { RenderTarget } from '../../renderers/shared/renderTarget/RenderTarget';
import type { Renderer } from '../../renderers/types';
import type { Container } from '../../scene/Container';
import type { AlphaMask } from './AlphaMask';
type MaskMode = 'pushMaskBegin' | 'pushMaskEnd' | 'popMaskBegin' | 'popMaskEnd';
declare class AlphaMaskEffect extends FilterEffect implements PoolItem {
    constructor();
    get sprite(): Sprite;
    set sprite(value: Sprite);
    init: () => void;
}
export interface AlphaMaskInstruction extends Instruction {
    type: 'alphaMask';
    action: MaskMode;
    mask: AlphaMask;
    maskedContainer: Container;
    renderMask: boolean;
}
export interface AlphaMaskData {
    filterEffect: AlphaMaskEffect;
    maskedContainer: Container;
    previousRenderTarget?: RenderTarget;
    filterTexture?: Texture;
}
export declare class AlphaMaskPipe implements InstructionPipe<AlphaMaskInstruction> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "alphaMask";
    };
    private renderer;
    private activeMaskStage;
    constructor(renderer: Renderer);
    push(mask: AlphaMask, maskedContainer: Container, instructionSet: InstructionSet): void;
    pop(mask: AlphaMask, _maskedContainer: Container, instructionSet: InstructionSet): void;
    execute(instruction: AlphaMaskInstruction): void;
    destroy(): void;
}
export {};
