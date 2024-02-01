import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { middlewares } from "../middlewares";
import { authController } from "../controllers/auth";
import { UserPriorityEnums } from "../enums/userPriorityEnum";

router.post(
  "/register",
  [
    body("phone_number").notEmpty().withMessage("Phone number is required"),
    body("phone_number")
      .isMobilePhone("en-IN")
      .withMessage("Phone number is invalid"),
    body("priority").notEmpty().withMessage("Priority is required"),
    body("priority")
      .isIn([
        UserPriorityEnums.LOW,
        UserPriorityEnums.MEDIUM,
        UserPriorityEnums.HIGH,
      ])
      .withMessage("Priority is invalid"),
  ],
  middlewares.validateRequest,
  authController.register
);

router.post(
  "/login",
  [
    body("phone_number")
      .isMobilePhone("en-IN")
      .withMessage("Phone number is required"),
  ],
  middlewares.validateRequest,
  authController.login
);

router.get("/", middlewares.requireAuth, authController.getUserDetails);

export { router as authRouter };
