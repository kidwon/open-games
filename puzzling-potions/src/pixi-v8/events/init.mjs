import { extensions } from '../extensions/Extensions.mjs';
import { Container } from '../rendering/scene/Container.mjs';
import { EventSystem } from './EventSystem.mjs';
import { FederatedContainer } from './FederatedEventTarget.mjs';

extensions.add(EventSystem);
Container.mixin(FederatedContainer);
//# sourceMappingURL=init.mjs.map
