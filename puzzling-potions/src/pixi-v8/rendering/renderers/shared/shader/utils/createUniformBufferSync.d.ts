import type { UBOElement } from './createUBOElements';
export type UniformsSyncCallback = (...args: any[]) => void;
export declare function generateUniformBufferSync(uboElements: UBOElement[]): UniformsSyncCallback;
