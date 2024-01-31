import { Request, Response } from "express";
import { User } from "../../models/userSchema";
import { BadRequestError } from "../../handlers/errors";
import { ActionSuccessHandler } from "../../handlers/responses";

export const login = async (req: Request, res: Response) => {
  const { phone_number } = req.body;

  const user = await User.findOne({ phone_number });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  req.session = {
    jwt: user.generateToken(),
  };


  new ActionSuccessHandler(res, "User logged in successfully", {
    user: user.toJSON(),
  });
};
