import { Container } from '../../scene/Container';
import { GraphicsContext } from './GraphicsContext';
import { GraphicsView } from './GraphicsView';
import type { ContainerOptions } from '../../scene/Container';
export interface GraphicsOptions extends ContainerOptions<GraphicsView> {
    context?: GraphicsContext;
}
export declare class Graphics extends Container<GraphicsView> {
    constructor(options?: GraphicsOptions | GraphicsContext);
    get context(): GraphicsContext;
    set context(context: GraphicsContext);
}
