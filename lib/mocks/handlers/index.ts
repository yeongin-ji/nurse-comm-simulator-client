import { documentHandlers } from "./documents";
import { scenarioHandlers } from "./scenarios";
import { sessionHandlers } from "./sessions";

export const handlers = [
  ...documentHandlers,
  ...scenarioHandlers,
  ...sessionHandlers,
];
