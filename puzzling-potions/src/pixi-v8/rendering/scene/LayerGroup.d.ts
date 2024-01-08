import { Matrix } from '../../maths/Matrix';
import { InstructionSet } from '../renderers/shared/instructions/InstructionSet';
import type { Instruction } from '../renderers/shared/instructions/Instruction';
import type { LayerRenderable } from '../renderers/shared/LayerRenderable';
import type { Renderable } from '../renderers/shared/Renderable';
import type { View } from '../renderers/shared/View';
import type { Container } from './Container';
export declare class LayerGroup implements Instruction {
    type: string;
    root: Container;
    rootRenderable: Renderable<View>;
    canBundle: boolean;
    layerGroupParent: LayerGroup;
    layerGroupChildren: LayerGroup[];
    children: Container[];
    worldTransform: Matrix;
    worldColor: number;
    readonly childrenToUpdate: Record<number, {
        list: Container[];
        index: number;
    }>;
    updateTick: number;
    readonly childrenRenderablesToUpdate: {
        list: Renderable[];
        index: number;
    };
    structureDidChange: boolean;
    instructionSet: InstructionSet;
    /**
     * proxy renderable is used to render the root containers view if it has one
     * this is used as we do not want to inherit the transform / color of the root container
     * it is only used by the parent root layer group
     */
    proxyRenderable: LayerRenderable<View>;
    constructor(root: Container);
    get localTransform(): Matrix;
    get layerTransform(): Matrix;
    addLayerGroupChild(layerGroupChild: LayerGroup): void;
    removeLayerGroupChild(layerGroupChild: LayerGroup): void;
    addChild(child: Container): void;
    removeChild(child: Container): void;
    onChildUpdate(child: Container): void;
    updateRenderable(container: Renderable): void;
    onChildViewUpdate(child: Renderable): void;
    removeChildFromUpdate(child: Container): void;
    get isRenderable(): boolean;
    onRenderContainers: Container[];
    /**
     * adding a container to the onRender list will make sure the user function
     * passed in to the user defined 'onRender` callBack
     * @param container - the container to add to the onRender list
     */
    addOnRender(container: Container): void;
    removeOnRender(container: Container): void;
    runOnRender(): void;
}
