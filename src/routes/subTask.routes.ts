import express from "express";
const router = express.Router();
import { body, param, query } from "express-validator";
import { middlewares } from "../middlewares";
import { subTaskController } from "../controllers/subTasks";
import { SubTaskStatusEnums } from "../enums/subTaskStatusEnum";

router.post(
  "/",
  middlewares.requireAuth,
  [
    body("task_id").notEmpty().withMessage("Task id is required"),
    body("task_id").isMongoId().withMessage("Task id is invalid"),
  ],
  middlewares.validateRequest,
  subTaskController.createSubTask
);

router.get(
  "/",
  middlewares.requireAuth,
  [query("task_id").optional().isMongoId().withMessage("Invalid task id")],
  middlewares.validateRequest,
  subTaskController.getSubTasks
);

router.put(
  "/:id",
  middlewares.requireAuth,
  [
    body("status").notEmpty().withMessage("Status is required"),
    body("status")
      .isIn([SubTaskStatusEnums.INCOMPLETE, SubTaskStatusEnums.COMPLETE])
      .withMessage("Invalid status"),
    param("id").notEmpty().withMessage("SubTask id is required"),
    param("id").isMongoId().withMessage("SubTask id is invalid"),
  ],
  middlewares.validateRequest,
  subTaskController.updateSubTask
);

router.delete(
  "/:id",
  middlewares.requireAuth,
  [
    param("id").notEmpty().withMessage("SubTask id is required"),
    param("id").isMongoId().withMessage("SubTask id is invalid"),
  ],
  middlewares.validateRequest,
  subTaskController.deleteSubTask
);

export { router as subTaskRouter };
