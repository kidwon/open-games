import { ExtensionType } from '../../../extensions/Extensions';
import { State } from '../../renderers/shared/state/State';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { BatchPipe, RenderPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Shader } from '../../renderers/shared/shader/Shader';
import type { GraphicsContextSystem } from './GraphicsContextSystem';
import type { GraphicsView } from './GraphicsView';
export interface GraphicsAdaptor {
    init(): void;
    execute(graphicsPipe: GraphicsPipe, renderable: Renderable<GraphicsView>): void;
    destroy(): void;
}
export interface GraphicsInstruction extends Instruction {
    type: 'graphics';
    renderable: Renderable<GraphicsView>;
}
export interface GraphicsSystem {
    graphicsContext: GraphicsContextSystem;
    renderPipes: {
        batch: BatchPipe;
    };
}
export declare class GraphicsPipe implements RenderPipe<GraphicsView> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "graphics";
    };
    renderer: GraphicsSystem;
    shader: Shader;
    state: State;
    private renderableBatchesHash;
    private adaptor;
    constructor(renderer: GraphicsSystem, adaptor: GraphicsAdaptor);
    validateRenderable(renderable: Renderable<GraphicsView>): boolean;
    addRenderable(renderable: Renderable<GraphicsView>, instructionSet: InstructionSet): void;
    updateRenderable(renderable: Renderable<GraphicsView>): void;
    execute({ renderable }: GraphicsInstruction): void;
    rebuild(renderable: Renderable<GraphicsView>): void;
    private addToBatcher;
    private getBatchesForRenderable;
    private initBatchesForRenderable;
    destroyRenderable(renderable: Renderable<GraphicsView>): void;
    private removeBatchForRenderable;
    destroy(): void;
}
