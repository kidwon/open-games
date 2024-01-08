import type { Container } from '../Container';
export interface OnRenderMixin {
    _onRender: (() => void) | null;
    onRender: () => void;
}
export declare const onRenderMixin: Partial<Container>;
