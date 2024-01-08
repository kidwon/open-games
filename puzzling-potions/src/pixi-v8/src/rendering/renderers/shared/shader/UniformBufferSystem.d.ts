import { ExtensionType } from '../../../../extensions/Extensions';
import type { Renderer } from '../../types';
import type { System } from '../system/System';
import type { UniformGroup } from './UniformGroup';
import type { UniformsSyncCallback } from './utils/createUniformBufferSync';
export declare class UniformBufferSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "uniformBuffer";
    };
    readonly renderer: Renderer;
    /** Cache of uniform buffer layouts and sync functions, so we don't have to re-create them */
    private _syncFunctionHash;
    constructor(renderer: Renderer);
    ensureUniformGroup(uniformGroup: UniformGroup): void;
    initUniformGroup(uniformGroup: UniformGroup): UniformsSyncCallback;
    syncUniformGroup(uniformGroup: UniformGroup, data?: Float32Array, offset?: number): boolean;
    updateUniformGroup(uniformGroup: UniformGroup): boolean;
    destroy(): void;
}
