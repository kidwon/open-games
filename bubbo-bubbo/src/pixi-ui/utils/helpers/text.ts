import { Text } from 'pixi.js';

export type PixiText = Text;
export type AnyText = string | number | PixiText;

export function getTextView(text: AnyText): Text
{
    if (text instanceof Text)
    {
        return text;
    }

    return new Text({ text: String(text) });

    return text;
}
