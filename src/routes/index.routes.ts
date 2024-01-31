import { Application } from "express";
import { NotFoundError } from "../handlers/errors";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";
import { subTaskRouter } from "./subTask.routes";
import { Request, Response } from "express";
import { jsonDb } from "../config/jsonDb";

export default (app: Application) => {
  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/subtask", subTaskRouter);

  app.post("/api/callback", (req: Request, res: Response) => {
    if (
      req.body.CallStatus === "completed" ||
      req.body.CallStatus === "in-progress"
    ) {
      jsonDb.set("callPicked", 1);
    } else if (req.body.CallStatus === "no-answer") {
      jsonDb.set("callPicked", -1);
    } else {
      jsonDb.set("callPicked", 0);
    }
    res.sendStatus(204);
  });

  app.use("*", (_req, _res) => {
    throw new NotFoundError();
  });
};
