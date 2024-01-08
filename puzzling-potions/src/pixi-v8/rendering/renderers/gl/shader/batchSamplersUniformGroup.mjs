import { MAX_TEXTURES } from '../../../batcher/shared/const.mjs';
import { UniformGroup } from '../../shared/shader/UniformGroup.mjs';

const sampleValues = new Int32Array(MAX_TEXTURES);
for (let i = 0; i < MAX_TEXTURES; i++) {
  sampleValues[i] = i;
}
const batchSamplersUniformGroup = new UniformGroup({
  uSamplers: { value: sampleValues, type: `array<u32,${MAX_TEXTURES}>` }
}, { isStatic: true });

export { batchSamplersUniformGroup };
//# sourceMappingURL=batchSamplersUniformGroup.mjs.map
