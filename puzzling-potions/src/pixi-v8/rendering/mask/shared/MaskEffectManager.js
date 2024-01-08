'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');

class MaskEffectManagerClass {
  constructor() {
    this._effectClasses = [];
    this.tests = [];
    this._initialized = false;
  }
  init() {
    if (this._initialized)
      return;
    this._initialized = true;
    this._effectClasses.forEach((test) => {
      this.add({
        test: test.test,
        maskClass: test
      });
    });
  }
  add(test) {
    this.tests.push(test);
  }
  getMaskEffect(item) {
    if (!this._initialized)
      this.init();
    for (let i = 0; i < this.tests.length; i++) {
      const test = this.tests[i];
      if (test.test(item)) {
        return PoolGroup.BigPool.get(test.maskClass, item);
      }
    }
    return item;
  }
  returnMaskEffect(effect) {
    PoolGroup.BigPool.return(effect);
  }
}
const MaskEffectManager = new MaskEffectManagerClass();
Extensions.extensions.handleByList(Extensions.ExtensionType.MaskEffect, MaskEffectManager._effectClasses);

exports.MaskEffectManager = MaskEffectManager;
exports.MaskEffectManagerClass = MaskEffectManagerClass;
//# sourceMappingURL=MaskEffectManager.js.map
