import { ExtensionType } from '../../../extensions/Extensions';
import { Texture } from '../shared/texture/Texture';
import type { RenderSurface } from '../gpu/renderTarget/GpuRenderTargetSystem';
import type { System } from '../shared/system/System';
import type { WebGLRenderer } from './WebGLRenderer';
export declare class GlBackBufferSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "backBuffer";
    };
    backBufferTexture: Texture;
    renderer: WebGLRenderer;
    targetTexture: Texture;
    useBackBuffer: boolean;
    constructor(renderer: WebGLRenderer);
    init({ useBackBuffer }?: {
        useBackBuffer?: boolean;
    }): void;
    renderStart({ target, clear }: {
        target: RenderSurface;
        clear: boolean;
    }): void;
    renderEnd(): void;
    private _presentBackBuffer;
    private _getBackBufferTexture;
    destroy(): void;
}
