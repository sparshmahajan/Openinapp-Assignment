import { Request, Response } from "express";
import { Task } from "../../models/taskSchema";
import { SubTask } from "../../models/subTaskSchema";
import { ActionSuccessHandler } from "../../handlers/responses";
import { NotFoundError } from "../../handlers/errors";
import { SubTaskStatusEnums } from "../../enums/subTaskStatusEnum";
import { TaskStatusEnums } from "../../enums/taskStatusEnum";

export const updateSubTask = async (req: Request, res: Response) => {
  const { id: subTask_id } = req.params as { id: string };
  const { status } = req.body as { status: number };

  const subTask = await SubTask.findById(subTask_id);

  if (!subTask || subTask.deleted_at) {
    throw new NotFoundError("SubTask not found");
  }

  subTask.status = status;
  subTask.updated_at = new Date();
  await subTask.save();

  const task = await Task.findById(subTask.task_id);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  const remainingSubTasks = await SubTask.find({
    task_id: subTask.task_id,
    status: SubTaskStatusEnums.INCOMPLETE,
    deleted_at: {
      $exists: false,
    },
  }).countDocuments();

  const completedSubTasks = await SubTask.find({
    task_id: subTask.task_id,
    status: SubTaskStatusEnums.COMPLETE,
    deleted_at: {
      $exists: false,
    },
  }).countDocuments();

  if (remainingSubTasks === 0 && completedSubTasks > 0) {
    task.status = TaskStatusEnums.DONE;
  } else if (remainingSubTasks > 0 && completedSubTasks > 0) {
    task.status = TaskStatusEnums.IN_PROGRESS;
  } else if (remainingSubTasks > 0 && completedSubTasks === 0) {
    task.status = TaskStatusEnums.TODO;
  }

  await task.save();

  return new ActionSuccessHandler(res, "SubTask Status updated Successfully", {
    subTask: subTask.toJSON(),
  });
};
