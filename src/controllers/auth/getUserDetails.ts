import { Request, Response } from "express";
import { User } from "../../models/userSchema";
import { NotFoundError } from "../../handlers/errors";
import { EntryFoundHandler } from "../../handlers/responses";

export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.user!;
  const user = await User.findById(id);
  
  if (!user) {
    throw new NotFoundError("User not found");
  }

  new EntryFoundHandler(res, "User found", {
    user: user.toJSON(),
  });
};
