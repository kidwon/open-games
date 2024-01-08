import { MeshGeometry } from '../rendering/mesh/shared/MeshGeometry';
import type { MeshGeometryOptions } from '../rendering/mesh/shared/MeshGeometry';
export interface PlaneGeometryOptions {
    width?: number;
    height?: number;
    verticesX?: number;
    verticesY?: number;
}
/**
 * @memberof PIXI
 */
export declare class PlaneGeometry extends MeshGeometry {
    static defaultOptions: PlaneGeometryOptions & MeshGeometryOptions;
    verticesX: number;
    verticesY: number;
    width: number;
    height: number;
    /**
     * @param options - Options to be applied to plane geometry
     * @param options.width - Width of plane
     * @param options.height - Height of plane
     * @param options.verticesX - Number of vertices on x-axis
     * @param options.verticesY - Number of vertices on y-axis
     */
    constructor(options?: PlaneGeometryOptions);
    /**
     * Refreshes plane coordinates
     * @param options
     */
    build(options: PlaneGeometryOptions): void;
}
