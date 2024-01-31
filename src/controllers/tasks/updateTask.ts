import { Request, Response } from "express";
import { Task } from "../../models/taskSchema";
import { ActionSuccessHandler } from "../../handlers/responses";
import { NotFoundError } from "../../handlers/errors";
import { TaskStatusEnums } from "../../enums/taskStatusEnum";
import { SubTask } from "../../models/subTaskSchema";

export const updateTask = async (req: Request, res: Response) => {
  const { id: task_id } = req.params as { id: string };
  const { due_date, status } = req.body as {
    due_date: Date;
    status?: TaskStatusEnums;
  };

  const task = await Task.findById(task_id);

  if (!task || task.deleted_at) {
    throw new NotFoundError("Task not found");
  }

  task.due_date = due_date;
  if (status) {
    task.status = status;
  }
  task.updated_at = new Date();
  await task.save();

  if (status) {
    const subTaskStatus = status === TaskStatusEnums.DONE ? 1 : 0;

    await SubTask.updateMany(
      { task_id: task._id },
      {
        $set: {
          status: subTaskStatus,
          updated_at: new Date(),
        },
      }
    );
  }
  return new ActionSuccessHandler(res, "Task updated successfully", {
    task: task.toJSON(),
  });
};
