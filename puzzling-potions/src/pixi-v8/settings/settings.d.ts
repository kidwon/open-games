import type { Adapter } from './adapter/adapter';
interface Settings {
    ADAPTER: Adapter;
    RETINA_PREFIX: RegExp;
    FAIL_IF_MAJOR_PERFORMANCE_CAVEAT: boolean;
    RESOLUTION: number;
}
/**
 * User's customizable globals for overriding the default PIXI settings, such
 * as a renderer's default resolution, framerate, float precision, etc.
 * @example
 * import { settings, ENV } from 'pixi.js';
 *
 * // Use the native window resolution as the default resolution
 * // will support high-density displays when rendering
 * settings.RESOLUTION = window.devicePixelRatio;
 * @namespace PIXI.settings
 */
declare const settings: Settings & Partial<PixiMixins.Settings>;
export { settings };
