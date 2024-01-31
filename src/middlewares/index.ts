import { requireAuth } from "./requireAuth";
import { validateRequest } from "./validateRequest";

export const middlewares = {
  requireAuth,
  validateRequest,
};
