class Pool {
  constructor(ClassType, initialSize) {
    this._pool = [];
    this._count = 0;
    this._index = 0;
    this._classType = ClassType;
    if (initialSize) {
      this.prepopulate(initialSize);
    }
  }
  prepopulate(total) {
    for (let i = 0; i < total; i++) {
      this._pool[this._index++] = new this._classType();
    }
    this._count += total;
  }
  get(data) {
    let item;
    if (this._index > 0) {
      item = this._pool[--this._index];
    } else {
      item = new this._classType();
    }
    item.init?.(data);
    return item;
  }
  return(item) {
    item.reset?.();
    this._pool[this._index++] = item;
  }
  get totalSize() {
    return this._count;
  }
  get totalFree() {
    return this._pool.length;
  }
  get totalUsed() {
    return this._count - this._pool.length;
  }
}

export { Pool };
//# sourceMappingURL=Pool.mjs.map
