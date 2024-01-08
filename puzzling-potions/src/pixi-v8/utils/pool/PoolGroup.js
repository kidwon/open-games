'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Pool = require('./Pool.js');

class PoolGroupClass {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  prepopulate(Class, total) {
    const classPool = this.getPool(Class);
    classPool.prepopulate(total);
  }
  get(Class, data) {
    const pool = this.getPool(Class);
    return pool.get(data);
  }
  return(item) {
    const pool = this.getPool(item.constructor);
    pool.return(item);
  }
  getPool(ClassType) {
    if (!this._poolsByClass.has(ClassType)) {
      this._poolsByClass.set(ClassType, new Pool.Pool(ClassType));
    }
    return this._poolsByClass.get(ClassType);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const stats = {};
    this._poolsByClass.forEach((pool) => {
      const name = stats[pool._classType.name] ? pool._classType.name + pool._classType.ID : pool._classType.name;
      stats[name] = {
        free: pool.totalFree,
        used: pool.totalUsed,
        size: pool.totalSize
      };
    });
    return stats;
  }
}
const BigPool = new PoolGroupClass();

exports.BigPool = BigPool;
exports.PoolGroupClass = PoolGroupClass;
//# sourceMappingURL=PoolGroup.js.map
