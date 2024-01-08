/// <reference types="dist" />
import { ExtensionType } from '../../../../extensions/Extensions';
import { State } from '../../shared/state/State';
import type { BLEND_MODES } from '../../shared/state/const';
import type { System } from '../../shared/system/System';
import type { GPU } from '../GpuDeviceSystem';
/** System plugin to the renderer to manage WebGL state machines. */
export declare class GpuStateSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "state";
    };
    /**
     * State ID
     * @readonly
     */
    stateId: number;
    /**
     * Polygon offset
     * @readonly
     */
    polygonOffset: number;
    /**
     * Blend mode
     * @default PIXI.BLEND_MODES.NONE
     * @readonly
     */
    blendMode: BLEND_MODES;
    /** Whether current blend equation is different */
    protected _blendEq: boolean;
    /**
     * GL context
     * @member {WebGLRenderingContext}
     * @readonly
     */
    protected gpu: GPU;
    /**
     * Default WebGL State
     * @readonly
     */
    protected defaultState: State;
    constructor();
    contextChange(gpu: GPU): void;
    getColorTargets(state: State): GPUColorTargetState[];
    destroy(): void;
}
