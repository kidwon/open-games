import { Pool } from './Pool';
import type { PoolItem, PoolItemConstructor } from './Pool';
export type PoolConstructor<T extends PoolItem> = new () => Pool<T>;
export declare class PoolGroupClass {
    private readonly _poolsByClass;
    prepopulate<T>(Class: PoolItemConstructor<T>, total: number): void;
    get<T>(Class: PoolItemConstructor<T>, data?: unknown): T;
    return(item: PoolItem): void;
    getPool<T>(ClassType: PoolItemConstructor<T>): Pool<T>;
    /** gets the usage stats of each pool in the system */
    stats(): Record<string, {
        free: number;
        used: number;
        size: number;
    }>;
}
export declare const BigPool: PoolGroupClass;
