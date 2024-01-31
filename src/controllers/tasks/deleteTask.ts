import { Request, Response } from "express";
import { Task } from "../../models/taskSchema";
import { ActionSuccessHandler } from "../../handlers/responses";
import { NotFoundError } from "../../handlers/errors";
import { SubTask } from "../../models/subTaskSchema";

export const deleteTask = async (req: Request, Res: Response) => {
  const { id: task_id } = req.params as { id: string };

  const task = await Task.findById(task_id);

  if (!task || task.deleted_at) {
    throw new NotFoundError("Task not found");
  }

  task.deleted_at = new Date();
  await task.save();

  await SubTask.updateMany(
    { task_id: task._id, deleted_at: { $exists: false } },
    {
      $set: {
        deleted_at: new Date(),
      },
    }
  );

  return new ActionSuccessHandler(Res, "Task deleted successfully", {});
};
