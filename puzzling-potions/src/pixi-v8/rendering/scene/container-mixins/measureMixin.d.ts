import type { Rectangle } from '../../../maths/shapes/Rectangle';
import type { Container } from '../Container';
export interface MeasureMixin {
    width: number;
    height: number;
    getLocalBounds(): Rectangle;
    getBounds(skipUpdate?: boolean): Rectangle;
}
export declare const measureMixin: Partial<Container>;
