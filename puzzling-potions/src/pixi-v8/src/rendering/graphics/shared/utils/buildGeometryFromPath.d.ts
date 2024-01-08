import { MeshGeometry } from '../../../mesh/shared/MeshGeometry';
import type { Matrix } from '../../../../maths/Matrix';
import type { GraphicsPath } from '../path/GraphicsPath';
export interface GeometryPathOptions {
    path: GraphicsPath;
    textureMatrix?: Matrix;
    out: MeshGeometry;
}
export declare function buildGeometryFromPath(options: GeometryPathOptions): MeshGeometry;
