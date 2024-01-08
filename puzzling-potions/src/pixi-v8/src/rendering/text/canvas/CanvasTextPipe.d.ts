import { ExtensionType } from '../../../extensions/Extensions';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Renderer } from '../../renderers/types';
import type { TextView } from '../TextView';
export declare class CanvasTextPipe implements RenderPipe<TextView> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "text";
    };
    private renderer;
    private gpuText;
    constructor(renderer: Renderer);
    validateRenderable(renderable: Renderable<TextView>): boolean;
    addRenderable(renderable: Renderable<TextView>, instructionSet: InstructionSet): void;
    updateRenderable(renderable: Renderable<TextView>): void;
    destroyRenderable(renderable: Renderable<TextView>): void;
    private destroyRenderableById;
    private updateText;
    private updateGpuText;
    private getGpuText;
    private initGpuText;
    destroy(): void;
}
