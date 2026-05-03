import { documentHandlers } from "./documents";
import { pblHandlers } from "./pbl";
import { scenarioHandlers } from "./scenarios";
import { sessionHandlers } from "./sessions";

export const handlers = [
  ...documentHandlers,
  ...scenarioHandlers,
  ...sessionHandlers,
  ...pblHandlers,
];
