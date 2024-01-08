import { ExtensionType } from '../../../extensions/Extensions';
import { BatchableSprite } from './BatchableSprite';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Renderer } from '../../renderers/types';
import type { SpriteView } from './SpriteView';
export declare class SpritePipe implements RenderPipe<SpriteView> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "sprite";
    };
    private renderer;
    private gpuSpriteHash;
    constructor(renderer: Renderer);
    addRenderable(renderable: Renderable<SpriteView>, instructionSet: InstructionSet): void;
    updateRenderable(renderable: Renderable<SpriteView>): void;
    validateRenderable(renderable: Renderable<SpriteView>): boolean;
    destroyRenderable(renderable: Renderable<SpriteView>): void;
    updateBatchableSprite(renderable: Renderable<SpriteView>, batchableSprite: BatchableSprite): void;
    getGpuSprite(renderable: Renderable<SpriteView>): BatchableSprite;
    initGPUSprite(renderable: Renderable<SpriteView>): BatchableSprite;
    destroy(): void;
}
