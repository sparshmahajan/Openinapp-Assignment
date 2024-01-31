import { Request, Response, NextFunction } from "express";
import { CustomError } from ".";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ message: err.serializeErrors().message });
  }

  console.log(err);
  res.status(500).send({
    message: "Something went wrong",
  });
};