import { ExtensionType } from '../../../extensions/Extensions';
import type { Rectangle } from '../../../maths/shapes/Rectangle';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { GpuRenderTarget } from '../gpu/renderTarget/GpuRenderTarget';
import type { BindGroup } from '../gpu/shader/BindGroup';
import type { Topology } from '../shared/geometry/const';
import type { Geometry } from '../shared/geometry/Geometry';
import type { RenderTarget } from '../shared/renderTarget/RenderTarget';
import type { Shader } from '../shared/shader/Shader';
import type { State } from '../shared/state/State';
import type { System } from '../shared/system/System';
import type { WebGLRenderer } from './WebGLRenderer';
export declare class GlEncoderSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "encoder";
    };
    readonly commandFinished: Promise<void>;
    private renderer;
    constructor(renderer: WebGLRenderer);
    start(): void;
    beginRenderPass(renderTarget: RenderTarget, _gpuRenderTarget: GpuRenderTarget): void;
    setViewport(_viewport: Rectangle): void;
    setScissor(bounds: Bounds): void;
    clearScissor(): void;
    setGeometry(geometry: Geometry, shader?: Shader): void;
    setShaderBindGroups(_shader: Shader, _sync?: boolean): void;
    syncBindGroup(_bindGroup: BindGroup): void;
    draw(options: {
        geometry: Geometry;
        shader: Shader;
        state?: State;
        topology?: Topology;
        size?: number;
        start?: number;
        instanceCount?: number;
        skipSync?: boolean;
    }): void;
    finishRenderPass(): void;
    finish(): void;
    restoreRenderPass(): void;
    destroy(): void;
}
