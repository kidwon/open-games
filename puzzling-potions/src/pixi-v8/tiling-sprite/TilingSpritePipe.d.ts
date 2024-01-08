import { ExtensionType } from '../extensions/Extensions';
import { Matrix } from '../maths/Matrix';
import { MeshView } from '../rendering/mesh/shared/MeshView';
import { ProxyRenderable } from '../rendering/renderers/shared/ProxyRenderable';
import type { TypedArray } from '../rendering/renderers/shared/buffer/Buffer';
import type { InstructionSet } from '../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../rendering/renderers/shared/Renderable';
import type { Renderer } from '../rendering/renderers/types';
import type { TilingSpriteView } from './TilingSpriteView';
interface RenderableData {
    batched: boolean;
}
export declare class TilingSpritePipe implements RenderPipe<TilingSpriteView> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "tilingSprite";
    };
    renderer: Renderer;
    renderableHash: Record<number, RenderableData>;
    gpuBatchedTilingSprite: Record<string, Renderable<MeshView>>;
    gpuTilingSprite: Record<string, {
        meshRenderable: Renderable<MeshView>;
        textureMatrix: Matrix;
    }>;
    constructor(renderer: Renderer);
    validateRenderable(renderable: Renderable<TilingSpriteView>): boolean;
    addRenderable(renderable: Renderable<TilingSpriteView>, instructionSet: InstructionSet): void;
    updateRenderable(renderable: Renderable<TilingSpriteView>): void;
    destroyRenderable(renderable: Renderable<TilingSpriteView>): void;
    getRenderableData(renderable: Renderable<TilingSpriteView>): RenderableData;
    initRenderableData(renderable: Renderable<TilingSpriteView>): RenderableData;
    rebuild(renderable: Renderable<TilingSpriteView>): void;
    getGpuTilingSprite(renderable: Renderable<TilingSpriteView>): {
        meshRenderable: Renderable<MeshView<import("..").MeshGeometry>>;
        textureMatrix: Matrix;
    } | {
        meshRenderable: ProxyRenderable<MeshView<import("..").MeshGeometry>>;
        textureMatrix: Matrix;
    };
    initGpuTilingSprite(renderable: Renderable<TilingSpriteView>): {
        meshRenderable: ProxyRenderable<MeshView<import("..").MeshGeometry>>;
        textureMatrix: Matrix;
    };
    getBatchedTilingSprite(renderable: Renderable<TilingSpriteView>): Renderable<MeshView>;
    initBatchedTilingSprite(renderable: Renderable<TilingSpriteView>): ProxyRenderable<MeshView<import("..").MeshGeometry>>;
    updateBatchPositions(renderable: Renderable<TilingSpriteView>): void;
    updateBatchUvs(renderable: Renderable<TilingSpriteView>): void;
    destroy(): void;
}
export declare function applyMatrix(array: TypedArray, stride: number, offset: number, matrix: Matrix): void;
export {};
