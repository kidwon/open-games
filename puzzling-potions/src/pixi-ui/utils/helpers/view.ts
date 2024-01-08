import { Container, Sprite } from 'pixi.js';

export function getView(view: string | Container): Container
{
    if (typeof view === 'string')
    {
        return Sprite.from(view);
    }

    return view;
}
