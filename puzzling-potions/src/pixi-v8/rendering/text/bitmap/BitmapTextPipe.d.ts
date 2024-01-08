import { ExtensionType } from '../../../extensions/Extensions';
import { GraphicsView } from '../../graphics/shared/GraphicsView';
import { ProxyRenderable } from '../../renderers/shared/ProxyRenderable';
import type { GraphicsContext } from '../../graphics/shared/GraphicsContext';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Renderer } from '../../renderers/types';
import type { TextView } from '../TextView';
declare class GraphicsProxyRenderable extends ProxyRenderable<GraphicsView> {
    constructor();
}
export declare class BitmapTextPipe implements RenderPipe<TextView> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "bitmapText";
    };
    private renderer;
    private gpuBitmapText;
    private sdfShader;
    constructor(renderer: Renderer);
    validateRenderable(renderable: Renderable<TextView>): boolean;
    addRenderable(renderable: Renderable<TextView>, instructionSet: InstructionSet): void;
    destroyRenderable(renderable: Renderable<TextView>): void;
    private destroyRenderableByUid;
    updateRenderable(renderable: Renderable<TextView>): void;
    updateContext(renderable: Renderable<TextView>, context: GraphicsContext): void;
    getGpuBitmapText(renderable: Renderable<TextView>): GraphicsProxyRenderable;
    initGpuText(renderable: Renderable<TextView>): GraphicsProxyRenderable;
    updateDistanceField(renderable: Renderable<TextView>): void;
    destroy(): void;
}
export {};
