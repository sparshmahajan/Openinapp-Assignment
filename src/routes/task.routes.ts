import express from "express";
const router = express.Router();
import { body, param, query } from "express-validator";
import { middlewares } from "../middlewares";
import { tasksController } from "../controllers/tasks";

router.post(
  "/",
  middlewares.requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("due_date").notEmpty().withMessage("Due date is required"),
    body("due_date")
      .isDate()
      .withMessage("Due date is invalid")
      .customSanitizer((value: string) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
      })
      .custom((value: Date) => {
        const today = new Date();
        if (value < today) {
          throw new Error("Due date cannot be in the past");
        }
        return true;
      }),
  ],
  middlewares.validateRequest,
  tasksController.createTask
);

router.get(
  "/",
  middlewares.requireAuth,
  [
    query("priority")
      .optional()
      .isIn(["0", "1-2", "3-4", "5+"])
      .withMessage("Invalid priority"),
    query("due_date")
      .optional()
      .isDate()
      .withMessage("Invalid due date")
      .customSanitizer((value: string) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
      }),
  ],
  middlewares.validateRequest,
  tasksController.getTasks
);

router.put(
  "/:id",
  middlewares.requireAuth,
  [
    body("status")
      .optional()
      .isIn(["IN_PROGRESS", "DONE"])
      .withMessage("Invalid status"),
    body("due_date").notEmpty().withMessage("Due date is required"),
    body("due_date")
      .isDate()
      .withMessage("Due date is invalid")
      .customSanitizer((value: string) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
      })
      .custom((value: Date) => {
        const today = new Date();
        if (value < today) {
          throw new Error("Due date cannot be in the past");
        }
        return true;
      }),
    param("id").notEmpty().withMessage("Task id is required"),
    param("id").isMongoId().withMessage("Task id is invalid"),
  ],
  middlewares.validateRequest,
  tasksController.updateTask
);

router.delete(
  "/:id",
  middlewares.requireAuth,
  [
    param("id").notEmpty().withMessage("Task id is required"),
    param("id").isMongoId().withMessage("Task id is invalid"),
  ],
  middlewares.validateRequest,
  tasksController.deleteTask
);

export { router as taskRouter };
