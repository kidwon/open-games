import { ExtensionType } from '../../../extensions/Extensions';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { MeshAdaptor, MeshPipe } from '../shared/MeshPipe';
import type { MeshView } from '../shared/MeshView';
export declare class GpuMeshAdapter implements MeshAdaptor {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUPipesAdaptor];
        readonly name: "mesh";
    };
    execute(meshPipe: MeshPipe, renderable: Renderable<MeshView>): void;
}
