import { Matrix } from '../../../maths/Matrix';
import { Bounds } from '../../scene/bounds/Bounds';
import type { Container } from '../../scene/Container';
export declare function addMaskLocalBounds(mask: Container, bounds: Bounds, localRoot: Container): void;
export declare function getMatrixRelativeToParent(target: Container, root: Container, matrix: Matrix): Matrix;
