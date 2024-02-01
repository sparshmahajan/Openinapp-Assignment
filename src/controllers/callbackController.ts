import { Request, Response } from "express";
import { jsonDb } from "../config/jsonDb";

export const callbackController = (req: Request, res: Response) => {
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
};
