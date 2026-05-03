import { documentHandlers } from "./documents";
import { scenarioHandlers } from "./scenarios";

export const handlers = [...documentHandlers, ...scenarioHandlers];
