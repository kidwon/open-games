import { ExtensionType } from '../../../extensions/Extensions';
import { Shader } from '../../renderers/shared/shader/Shader';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { GraphicsAdaptor, GraphicsPipe } from '../shared/GraphicsPipe';
import type { GraphicsView } from '../shared/GraphicsView';
export declare class GpuGraphicsAdaptor implements GraphicsAdaptor {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUPipesAdaptor];
        readonly name: "graphics";
    };
    shader: Shader;
    init(): void;
    execute(graphicsPipe: GraphicsPipe, renderable: Renderable<GraphicsView>): void;
    destroy(): void;
}
