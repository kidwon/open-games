import { ExtensionType } from '../../../extensions/Extensions';
import type { System } from '../shared/system/System';
import type { WebGPURenderer } from './WebGPURenderer';
export declare class GpuColorMaskSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "colorMask";
    };
    private renderer;
    private colorMaskCache;
    constructor(renderer: WebGPURenderer);
    setMask(colorMask: number): void;
    destroy(): void;
}
