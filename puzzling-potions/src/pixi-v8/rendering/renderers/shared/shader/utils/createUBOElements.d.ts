export type UNIFORM_TYPES = 'f32' | 'vec2<f32>' | 'vec3<f32>' | 'vec4<f32>' | 'mat2x2<f32>' | 'mat3x3<f32>' | 'mat4x4<f32>';
export declare const WGSL_TO_STD40_SIZE: Record<string, number>;
export interface UniformData {
    /** the value of the uniform, this could be any object - a parser will figure out how to write it to the buffer */
    value: unknown;
    type: UNIFORM_TYPES;
    /** the size of the variable (eg 2 for vec2, 3 for vec3, 4 for vec4) */
    size?: number;
    name?: string;
}
export interface UBOElement {
    data: UniformData;
    offset: number;
    size: number;
}
export interface UniformBufferLayout {
    uboElements: UBOElement[];
    /** float32 size // TODO change to bytes */
    size: number;
}
export declare function createUBOElements(uniformData: UniformData[]): UniformBufferLayout;
