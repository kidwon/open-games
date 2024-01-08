import { ExtensionType } from '../../../extensions/Extensions';
import { Matrix } from '../../../maths/Matrix';
import { RenderTarget } from '../shared/renderTarget/RenderTarget';
import { SystemRunner } from '../shared/system/SystemRunner';
import { Texture } from '../shared/texture/Texture';
import type { RenderSurface, RGBAArray } from '../gpu/renderTarget/GpuRenderTargetSystem';
import type { System } from '../shared/system/System';
import type { GlRenderingContext } from './context/GlRenderingContext';
import type { WebGLRenderer } from './WebGLRenderer';
export declare class GlRenderTargetSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "renderTarget";
    };
    rootProjectionMatrix: Matrix;
    renderingToScreen: boolean;
    rootRenderTarget: RenderTarget;
    renderTarget: RenderTarget;
    onRenderTargetChange: SystemRunner;
    private gl;
    private renderSurfaceToRenderTargetHash;
    private gpuRenderTargetHash;
    private renderer;
    private renderTargetStack;
    private defaultClearColor;
    private clearColorCache;
    private viewPortCache;
    constructor(renderer: WebGLRenderer);
    contextChange(gl: GlRenderingContext): void;
    start(rootRenderSurface: any, clear?: boolean, clearColor?: RGBAArray): void;
    renderEnd(): void;
    bind(renderSurface: RenderSurface, clear?: boolean, clearColor?: RGBAArray): RenderTarget;
    /**
     * returns the gpu texture for the first color texture in the render target
     * mainly used by the filter manager to get copy the texture for blending
     * @param renderTarget
     * @returns a gpu texture
     */
    getGpuColorTexture(renderTarget: RenderTarget): Texture;
    push(renderSurface: RenderSurface, clear?: boolean, clearColor?: RGBAArray): RenderTarget;
    pop(): void;
    getRenderTarget(renderSurface: RenderSurface): RenderTarget;
    private initRenderTarget;
    finishRenderPass(): void;
    finish(): void;
    copyToTexture(sourceRenderSurfaceTexture: RenderTarget, destinationTexture: Texture, origin: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): Texture;
    private getGpuRenderTarget;
    private initGpuRenderTarget;
    private resizeGpuRenderTarget;
    private initColor;
    private resizeColor;
    private initStencil;
    private resizeStencil;
    destroy(): void;
}
