import { Request, Response } from "express";
import { Task } from "../../models/taskSchema";
import { SubTask } from "../../models/subTaskSchema";
import { ActionSuccessHandler } from "../../handlers/responses";
import { BadRequestError, NotFoundError } from "../../handlers/errors";
import { TaskStatusEnums } from "../../enums/taskStatusEnum";

export const createSubTask = async (req: Request, res: Response) => {
  const { task_id } = req.body as { task_id: string };

  const task = await Task.findById(task_id);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.due_date < new Date()) {
    throw new BadRequestError("Task is overdue");
  }

  if (task.status === TaskStatusEnums.DONE) {
    task.status = TaskStatusEnums.IN_PROGRESS;
    await task.save();
  }

  const subTask = await SubTask.build({ task_id: task._id });

  return new ActionSuccessHandler(
    res,
    "SubTask created successfully",
    subTask,
    201
  );
};
