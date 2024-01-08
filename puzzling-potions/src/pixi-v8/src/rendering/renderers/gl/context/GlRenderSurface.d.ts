import type { ICanvas } from '../../../../settings/adapter/ICanvas';
import type { GlRenderingContext } from './GlRenderingContext';
import type { WebGLExtensions } from './WebGLExtensions';
export declare class GlRenderSurface {
    gl: GlRenderingContext;
    extensions: WebGLExtensions;
    uid: number;
    element: ICanvas;
    initFromCanvas(element: ICanvas): void;
}
