import { ExtensionType } from '../../../extensions/Extensions';
import { STENCIL_MODES } from '../shared/state/const';
import type { RenderTarget } from '../shared/renderTarget/RenderTarget';
import type { System } from '../shared/system/System';
import type { WebGPURenderer } from './WebGPURenderer';
export declare class GpuStencilSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "stencil";
    };
    private renderer;
    private renderTargetStencilState;
    private activeRenderTarget;
    constructor(renderer: WebGPURenderer);
    onRenderTargetChange(renderTarget: RenderTarget): void;
    setStencilMode(stencilMode: STENCIL_MODES, stencilReference: number): void;
    destroy(): void;
}
