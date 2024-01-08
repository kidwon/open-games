import type { BindResource } from '../../gpu/shader/BindResource';
import type { Buffer } from '../buffer/Buffer';
import type { UniformData } from './utils/createUBOElements';
type FLOPS<T = UniformData> = T extends {
    value: infer V;
} ? V : never;
type ExtractUniformObject<T = Record<string, UniformData>> = {
    [K in keyof T]: FLOPS<T[K]>;
};
export type UniformGroupOptions = {
    ubo?: boolean;
    isStatic?: boolean;
};
export declare class UniformGroup<UNIFORMS extends {
    [key: string]: UniformData;
} = any> implements BindResource {
    static DEFAULT: UniformGroupOptions;
    readonly uid: number;
    resourceType: string;
    resourceId: number;
    uniformStructures: UNIFORMS;
    uniforms: ExtractUniformObject<UNIFORMS>;
    ubo: boolean;
    buffer?: Buffer;
    isStatic: boolean;
    readonly isUniformGroup = true;
    dirtyId: number;
    readonly signature: string;
    _syncFunction?: (uniforms: UNIFORMS, data: Float32Array, offset: number) => void;
    constructor(uniformStructures: UNIFORMS, options?: UniformGroupOptions);
    update(): void;
}
export {};
