import { UniformGroup } from '../../shared/shader/UniformGroup';
import type { UNIFORM_TYPES } from '../../shared/shader/utils/createUBOElements';
export declare const batchSamplersUniformGroup: UniformGroup<{
    uSamplers: {
        value: Int32Array;
        type: UNIFORM_TYPES;
    };
}>;
