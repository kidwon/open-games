import { extensions, ExtensionType } from '../../../extensions/Extensions.mjs';
import { BigPool } from '../../../utils/pool/PoolGroup.mjs';

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
        return BigPool.get(test.maskClass, item);
      }
    }
    return item;
  }
  returnMaskEffect(effect) {
    BigPool.return(effect);
  }
}
const MaskEffectManager = new MaskEffectManagerClass();
extensions.handleByList(ExtensionType.MaskEffect, MaskEffectManager._effectClasses);

export { MaskEffectManager, MaskEffectManagerClass };
//# sourceMappingURL=MaskEffectManager.mjs.map
