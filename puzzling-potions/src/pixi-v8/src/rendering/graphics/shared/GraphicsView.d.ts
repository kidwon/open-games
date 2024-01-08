import { GraphicsContext } from './GraphicsContext';
import type { PointData } from '../../../maths/PointData';
import type { View } from '../../renderers/shared/View';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { ContextDestroyOptions, TextureDestroyOptions, TypeOrBool } from '../../scene/destroyTypes';
export declare class GraphicsView implements View {
    uid: number;
    canBundle: boolean;
    owner: import("../../renderers/shared/View").ViewObserver;
    batched: boolean;
    type: string;
    didUpdate: boolean;
    private _context;
    constructor(graphicsContext?: GraphicsContext);
    set context(context: GraphicsContext);
    get context(): GraphicsContext;
    addBounds(bounds: Bounds): void;
    containsPoint(point: PointData): boolean;
    protected onGraphicsContextUpdate(): void;
    /**
     * Destroys this graphics renderable and optionally its context.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should destroy the texture of the graphics context
     * @param {boolean} [options.textureSource=false] - Should destroy the texture source of the graphics context
     * @param {boolean} [options.context=false] - Should destroy the context
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions & ContextDestroyOptions>): void;
}
