/// <reference types="dist" />
import { ExtensionType } from '../../../../extensions/Extensions';
import { Matrix } from '../../../../maths/Matrix';
import { RenderTarget } from '../../shared/renderTarget/RenderTarget';
import { SystemRunner } from '../../shared/system/SystemRunner';
import { Texture } from '../../shared/texture/Texture';
import type { ICanvas } from '../../../../settings/adapter/ICanvas';
import type { System } from '../../shared/system/System';
import type { BindableTexture } from '../../shared/texture/Texture';
import type { GPU } from '../GpuDeviceSystem';
import type { WebGPURenderer } from '../WebGPURenderer';
export type RenderSurface = ICanvas | BindableTexture | RenderTarget;
export type RGBAArray = [number, number, number, number];
export declare class GpuRenderTargetSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "renderTarget";
    };
    rootRenderTarget: RenderTarget;
    renderingToScreen: boolean;
    rootProjectionMatrix: Matrix;
    renderTarget: RenderTarget;
    onRenderTargetChange: SystemRunner;
    private renderSurfaceToRenderTargetHash;
    private gpuRenderTargetHash;
    private renderTargetStack;
    private renderer;
    private gpu;
    constructor(renderer: WebGPURenderer);
    renderStart({ target, clear, clearColor, }: {
        target: RenderSurface;
        clear: boolean;
        clearColor: RGBAArray;
    }): void;
    protected contextChange(gpu: GPU): void;
    bind(renderSurface: RenderSurface, clear?: boolean, clearColor?: RGBAArray): RenderTarget;
    /**
     * returns the gpu texture for the first color texture in the render target
     * mainly used by the filter manager to get copy the texture for blending
     * @param renderTarget
     * @returns a gpu texture
     */
    getGpuColorTexture(renderTarget: RenderTarget): GPUTexture;
    getDescriptor(renderTarget: RenderTarget, clear: boolean, clearValue: RGBAArray): GPURenderPassDescriptor;
    push(renderSurface: RenderSurface, clear?: boolean, clearColor?: RGBAArray): RenderTarget;
    pop(): void;
    getRenderTarget(renderSurface: RenderSurface): RenderTarget;
    copyToTexture(sourceRenderSurfaceTexture: RenderTarget, destinationTexture: Texture, origin: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): Texture;
    restart(): void;
    destroy(): void;
    private initRenderTarget;
    private getGpuRenderTarget;
    private initGpuRenderTarget;
    private resizeGpuRenderTarget;
}
