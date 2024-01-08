import { Container } from '../../scene/Container.mjs';
import { GraphicsContext } from './GraphicsContext.mjs';
import { GraphicsView } from './GraphicsView.mjs';

class Graphics extends Container {
  constructor(options) {
    if (options instanceof GraphicsContext) {
      options = { context: options };
    }
    super({
      view: new GraphicsView(options?.context),
      label: "Graphics",
      ...options
    });
  }
  get context() {
    return this.view.context;
  }
  set context(context) {
    this.view.context = context;
  }
}

export { Graphics };
//# sourceMappingURL=Graphics.mjs.map
