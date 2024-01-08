import { ExtensionType } from '../../../extensions/Extensions';
import { STENCIL_MODES } from '../shared/state/const';
import type { RenderTarget } from '../shared/renderTarget/RenderTarget';
import type { System } from '../shared/system/System';
import type { WebGLRenderer } from './WebGLRenderer';
export declare class GlStencilSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "stencil";
    };
    private gl;
    private stencilCache;
    private renderTargetStencilState;
    private stencilOpsMapping;
    private comparisonFuncMapping;
    private activeRenderTarget;
    constructor(renderer: WebGLRenderer);
    protected contextChange(gl: WebGLRenderingContext): void;
    onRenderTargetChange(renderTarget: RenderTarget): void;
    setStencilMode(stencilMode: STENCIL_MODES, stencilReference: number): void;
    destroy(): void;
}
