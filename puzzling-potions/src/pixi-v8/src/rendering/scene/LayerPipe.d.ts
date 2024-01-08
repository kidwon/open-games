import { ExtensionType } from '../../extensions/Extensions';
import type { InstructionSet } from '../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../renderers/types';
import type { LayerGroup } from './LayerGroup';
export declare class LayerPipe implements InstructionPipe<LayerGroup> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "layer";
    };
    private renderer;
    constructor(renderer: Renderer);
    addLayerGroup(layerGroup: LayerGroup, instructionSet: InstructionSet): void;
    execute(layerGroup: LayerGroup): void;
    destroy(): void;
}
