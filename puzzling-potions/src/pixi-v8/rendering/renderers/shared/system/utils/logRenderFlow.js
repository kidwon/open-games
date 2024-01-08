'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function logRenderFlow(renderer) {
  console.log("Render Flow");
  ["prerender", "renderStart", "render", "renderEnd", "postrender"].forEach((runnerId) => {
    logRunner(renderer.runners[runnerId]);
  });
}
function logRunner(runner) {
  console.log(` - ${runner.name}`);
  for (let i = 0; i < runner.items.length; i++) {
    console.log(`   ${i + 1}.`, runner.items[i].constructor.name || "anonymous");
  }
}

exports.logRenderFlow = logRenderFlow;
//# sourceMappingURL=logRenderFlow.js.map
