import type { ICanvasRenderingContext2D } from '../../../../settings/adapter/ICanvasRenderingContext2D';
import type { FillStyle } from '../../../graphics/shared/GraphicsContext';
export declare function getCanvasFillStyle(fillStyle: FillStyle, context: ICanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
