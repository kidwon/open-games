import type { Container } from '../Container';
export interface GetByLabelMixin {
    getChildByLabel(label: RegExp | string, deep?: boolean): Container | null;
    getChildrenByLabel(label: RegExp | string, deep?: boolean, out?: Container[]): Container[];
}
export declare const findMixin: Partial<Container>;
