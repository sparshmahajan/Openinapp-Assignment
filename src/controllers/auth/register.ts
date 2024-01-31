import { Request, Response } from "express";
import { User } from "../../models/userSchema";
import { BadRequestError } from "../../handlers/errors";
import { ActionSuccessHandler } from "../../handlers/responses";

export const register = async (req: Request, res: Response) => {
  const { phone_number, priority } = req.body;

  const existingUser = await User.findOne({ phone_number });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const newUser = await User.build({
    phone_number,
    priority,
  });

  new ActionSuccessHandler(res, "User created successfully", {
    user: newUser,
  });
};
