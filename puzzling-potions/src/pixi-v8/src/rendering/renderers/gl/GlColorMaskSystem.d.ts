import { ExtensionType } from '../../../extensions/Extensions';
import type { System } from '../shared/system/System';
import type { WebGLRenderer } from './WebGLRenderer';
export declare class GlColorMaskSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "colorMask";
    };
    private renderer;
    private colorMaskCache;
    constructor(renderer: WebGLRenderer);
    setMask(colorMask: number): void;
    destroy(): void;
}
