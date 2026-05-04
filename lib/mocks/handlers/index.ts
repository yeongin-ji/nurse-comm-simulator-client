import { documentHandlers } from "./documents";
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
];
