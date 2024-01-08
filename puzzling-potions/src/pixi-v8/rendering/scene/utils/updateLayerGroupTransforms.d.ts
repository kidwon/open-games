import { Container } from '../Container';
import type { LayerGroup } from '../LayerGroup';
export declare function updateLayerGroupTransforms(layerGroup: LayerGroup, updateChildRenderGroups?: boolean): void;
export declare function updateLayerTransform(layerGroup: LayerGroup): void;
export declare function updateTransformAndChildren(container: Container, updateTick: number, updateFlags: number): void;
