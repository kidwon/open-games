import type { PRECISION } from '../const';
/**
 * Sets the float precision on the shader, ensuring the device supports the request precision.
 * If the precision is already present, it just ensures that the device is able to handle it.
 * @param src
 * @param root0
 * @param root0.requestedPrecision
 * @param root0.maxSupportedPrecision
 */
export declare function ensurePrecision(src: string, { requestedPrecision, maxSupportedPrecision }: {
    requestedPrecision: PRECISION;
    maxSupportedPrecision: PRECISION;
}): string;
