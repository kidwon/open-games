'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Container = require('../scene/Container.js');
var TextView = require('./TextView.js');

class Text extends Container.Container {
  constructor(options) {
    super({
      view: new TextView.TextView(options),
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

exports.Text = Text;
//# sourceMappingURL=Text.js.map
