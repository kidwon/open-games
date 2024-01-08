'use strict';

var Extensions = require('../extensions/Extensions.js');
var AlphaMask = require('./mask/shared/AlphaMask.js');
var ColorMask = require('./mask/shared/ColorMask.js');
var StencilMask = require('./mask/shared/StencilMask.js');

Extensions.extensions.add(AlphaMask.AlphaMask, ColorMask.ColorMask, StencilMask.StencilMask);
//# sourceMappingURL=init.js.map
