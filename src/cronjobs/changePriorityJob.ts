import { Task, TaskDoc } from "../models/taskSchema";
import { taskPriorityCalculation } from "../common/taskPriorityCalculation";
import { TaskStatusEnums } from "../enums/taskStatusEnum";

export const changePriorityJob = async () => {
  const tasks = await Task.find({
    deleted_at: {
      $exists: false,
    },
    status: {
      $ne: TaskStatusEnums.DONE,
    },
  });

  tasks.forEach(async (task: TaskDoc) => {
    const priority = taskPriorityCalculation(task.due_date);
    task.priority = priority;
    await task.save();
  });
};
