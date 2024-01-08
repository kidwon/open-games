export declare class Pool<T extends PoolItem> {
    readonly _classType: PoolItemConstructor<T>;
    private readonly _pool;
    private _count;
    private _index;
    constructor(ClassType: PoolItemConstructor<T>, initialSize?: number);
    prepopulate(total: number): void;
    get(data?: unknown): T;
    return(item: T): void;
    get totalSize(): number;
    get totalFree(): number;
    get totalUsed(): number;
}
export type PoolItem = {
    init?: (data?: any) => void;
    reset?: () => void;
};
export type PoolItemConstructor<K extends PoolItem> = new () => K;
