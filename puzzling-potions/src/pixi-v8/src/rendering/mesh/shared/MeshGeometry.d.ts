import { Geometry } from '../../renderers/shared/geometry/Geometry';
import type { BatchMode } from '../../graphics/shared/GraphicsContext';
import type { Topology } from '../../renderers/shared/geometry/const';
export interface MeshGeometryOptions {
    positions?: Float32Array;
    uvs?: Float32Array;
    indices?: Uint32Array;
    topology?: Topology;
}
export declare class MeshGeometry extends Geometry {
    static defaultOptions: MeshGeometryOptions;
    batchMode: BatchMode;
    constructor(options?: MeshGeometryOptions);
    get positions(): Float32Array;
    set positions(value: Float32Array);
    get uvs(): Float32Array;
    set uvs(value: Float32Array);
    get indices(): Uint32Array;
    set indices(value: Uint32Array);
}
