import { Container } from '../scene/Container.mjs';
import { TextView } from './TextView.mjs';

class Text extends Container {
  constructor(options) {
    super({
      view: new TextView(options),
      label: "Text",
      ...options
    });
  }
  get anchor() {
    return this.view.anchor;
  }
  set text(value) {
    this.view.text = value;
  }
  get text() {
    return this.view.text;
  }
  set style(value) {
    this.view.style = value;
  }
  get style() {
    return this.view.style;
  }
}

export { Text };
//# sourceMappingURL=Text.mjs.map
