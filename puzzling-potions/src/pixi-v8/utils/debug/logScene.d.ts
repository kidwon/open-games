import type { Container } from '../../rendering/scene/Container';
import type { LayerGroup } from '../../rendering/scene/LayerGroup';
export declare function logScene(container: Container, depth?: number, data?: {
    color?: string;
}): void;
export declare function logLayerGroupScene(layerGroup: LayerGroup, depth?: number, data?: {
    index: number;
    color?: string;
}): void;
