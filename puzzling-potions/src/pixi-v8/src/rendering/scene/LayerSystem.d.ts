import { ExtensionType } from '../../extensions/Extensions';
import type { System } from '../renderers/shared/system/System';
import type { Renderer } from '../renderers/types';
import type { Container } from './Container';
/**
 * The view system manages the main canvas that is attached to the DOM.
 * This main role is to deal with how the holding the view reference and dealing with how it is resized.
 * @memberof PIXI
 */
export declare class LayerSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "layer";
    };
    private renderer;
    constructor(renderer: Renderer);
    render({ container }: {
        container: Container;
    }): void;
    destroy(): void;
}
