import { Container } from '../scene/Container';
import { TextView } from './TextView';
import type { ContainerOptions } from '../scene/Container';
import type { TextStyle } from './TextStyle';
import type { TextString, TextViewOptions } from './TextView';
export type TextOptions = ContainerOptions<TextView> & TextViewOptions;
export declare class Text extends Container<TextView> {
    constructor(options: TextOptions);
    get anchor(): import("../..").ObservablePoint;
    set text(value: TextString);
    get text(): string;
    set style(value: TextStyle | Partial<TextStyle>);
    get style(): TextStyle;
}
