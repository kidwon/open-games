import type { UNIFORM_TYPES, UniformData } from './createUBOElements';
export interface UniformParser {
    type: UNIFORM_TYPES;
    test: (data: UniformData) => boolean;
    code: (name: string) => string;
}
export declare const uniformBufferParsers: UniformParser[];
