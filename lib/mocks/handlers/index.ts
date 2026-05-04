import { commentHandlers } from "./comments";
import { documentHandlers } from "./documents";
import { evaluationHandlers } from "./evaluation";
import { passthroughHandlers } from "./passthrough";
import { pblHandlers } from "./pbl";
import { scenarioHandlers } from "./scenarios";
import { sessionHandlers } from "./sessions";
import { simulateHandlers } from "./simulate";

export const handlers = [
  ...documentHandlers,
  ...scenarioHandlers,
  ...sessionHandlers,
  ...pblHandlers,
  ...simulateHandlers,
  ...evaluationHandlers,
  ...commentHandlers,
  // Must come last so concrete handlers above match first.
  ...passthroughHandlers,
];
