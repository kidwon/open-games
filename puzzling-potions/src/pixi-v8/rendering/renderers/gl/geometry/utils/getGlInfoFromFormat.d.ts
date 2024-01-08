import type { VertexFormat } from '../../../shared/geometry/const';
export declare function getGlInfoFromFormat(format: VertexFormat): {
    type: number;
    size: number;
    normalised: boolean;
};
