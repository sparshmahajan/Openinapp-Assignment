import { Application } from "express";
import { NotFoundError } from "../handlers/errors";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";
import { subTaskRouter } from "./subTask.routes";
import { callbackController } from "../controllers/callbackController";

export default (app: Application) => {
  app.use("/api/auth", authRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/subtask", subTaskRouter);
  app.post("/api/callback", callbackController);

  app.use("*", (_req, _res) => {
    throw new NotFoundError();
  });
};
