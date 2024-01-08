import { Container } from '../../scene/Container';
import { MeshView } from './MeshView';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { ContainerOptions } from '../../scene/Container';
import type { MeshGeometry } from './MeshGeometry';
import type { MeshViewOptions } from './MeshView';
export type MeshOptions = ContainerOptions<MeshView> & MeshViewOptions;
export declare class Mesh extends Container<MeshView> {
    constructor(options: MeshOptions);
    get texture(): Texture;
    set texture(value: Texture);
    get geometry(): MeshGeometry;
    set geometry(value: MeshGeometry);
}
