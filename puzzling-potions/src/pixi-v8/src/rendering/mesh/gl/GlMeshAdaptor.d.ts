import { ExtensionType } from '../../../extensions/Extensions';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { MeshAdaptor, MeshPipe } from '../shared/MeshPipe';
import type { MeshView } from '../shared/MeshView';
export declare class GlMeshAdaptor implements MeshAdaptor {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipesAdaptor];
        readonly name: "mesh";
    };
    execute(meshPipe: MeshPipe, renderable: Renderable<MeshView>): void;
}
