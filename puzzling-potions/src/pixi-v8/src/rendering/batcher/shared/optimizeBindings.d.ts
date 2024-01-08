import type { TextureSource } from '../../renderers/shared/texture/sources/TextureSource';
import type { TextureBatch } from './Batcher';
export declare const missing: TextureSource[];
export declare let missingCount: number;
export declare const currentCopy: TextureSource[];
export declare let currentCount: number;
export declare const usedSlots: Record<number, number>;
/**
 * This function will take the previous texture batch and the current texture batch and
 * will optimize the current texture batch by reusing already bound textures that are already bound
 *
 * essentially, this should result in lest texture binds in the renderer.
 *
 * and will return the optimized texture batch.
 * @param previousTextureBatch - the previous texture batch to compare to
 * @param currentTextureBatch - the current texture batch modify and optimize
 * @param tick - this batchers tick, used to check if textures were used in the previous batch
 * @param bindingOffset - an offset to the next binding location
 * @returns the optimized texture batch (same as currentTextureBatch)
 */
export declare function optimizeBindings(previousTextureBatch: TextureBatch, currentTextureBatch: TextureBatch, tick: number, bindingOffset: number): TextureBatch;
