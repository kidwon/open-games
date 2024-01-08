'use strict';

var Extensions = require('../extensions/Extensions.js');
var Container = require('../rendering/scene/Container.js');
var EventSystem = require('./EventSystem.js');
var FederatedEventTarget = require('./FederatedEventTarget.js');

Extensions.extensions.add(EventSystem.EventSystem);
Container.Container.mixin(FederatedEventTarget.FederatedContainer);
//# sourceMappingURL=init.js.map
