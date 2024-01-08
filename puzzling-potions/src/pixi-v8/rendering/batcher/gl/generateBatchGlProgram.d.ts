import { GlProgram } from '../../renderers/gl/shader/GlProgram';
export declare function generateBatchGlProgram({ vertexSrc, fragmentSrc, maxTextures, name }: {
    vertexSrc: string;
    fragmentSrc: string;
    maxTextures: number;
    name?: string;
}): GlProgram;
