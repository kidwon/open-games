'use strict';

var Extensions = require('../extensions/Extensions.js');
var TickerPlugin = require('../ticker/TickerPlugin.js');
var ResizePlugin = require('./ResizePlugin.js');

Extensions.extensions.add(ResizePlugin.ResizePlugin);
Extensions.extensions.add(TickerPlugin.TickerPlugin);
//# sourceMappingURL=init.js.map
