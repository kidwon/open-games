/**
 * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
 * @example
 * PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
 * @param hex - The hexadecimal number to convert
 * @param out - If supplied, this array will be used rather than returning a new one
 * @returns  An array representing the [R, G, B] of the color where all values are floats.
 */
export declare function hex2rgb(hex: number, out?: number[]): number[];
/**
 * Converts a hexadecimal color number to a string.
 * @example
 * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
 * @memberof PIXI.utils
 * @function hex2string
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @returns {string} The string color (e.g., `"#ffffff"`).
 */
export declare function hex2string(hex: number): string;
/**
 * Converts a string to a hexadecimal color number.
 * It can handle:
 *  hex strings starting with #: "#ffffff"
 *  hex strings starting with 0x: "0xffffff"
 *  hex strings without prefix: "ffffff"
 *  css colors: "black"
 * @example
 * PIXI.utils.string2hex("#ffffff"); // returns 0xffffff
 * @memberof PIXI.utils
 * @function string2hex
 * @param {string} string - The string color (e.g., `"#ffffff"`)
 * @returns {number} Number in hexadecimal.
 */
export declare function string2hex(string: string): number;
/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @example
 * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
 * @memberof PIXI.utils
 * @function rgb2hex
 * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @returns {number} Number in hexadecimal.
 */
export declare function rgb2hex(rgb: number[] | Float32Array): number;
