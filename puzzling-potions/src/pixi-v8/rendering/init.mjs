import { extensions } from '../extensions/Extensions.mjs';
import { AlphaMask } from './mask/shared/AlphaMask.mjs';
import { ColorMask } from './mask/shared/ColorMask.mjs';
import { StencilMask } from './mask/shared/StencilMask.mjs';

extensions.add(AlphaMask, ColorMask, StencilMask);
//# sourceMappingURL=init.mjs.map
