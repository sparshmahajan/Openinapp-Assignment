import { Task, TaskDoc } from "../models/taskSchema";
import { taskPriorityCalculation } from "../common/taskPriorityCalculation";

export const changePriorityJob = async () => {
  const tasks = await Task.find({
    deleted_at: {
      $exists: false,
    },
  });

  tasks.forEach(async (task: TaskDoc) => {
    const priority = taskPriorityCalculation(task.due_date);
    task.priority = priority;
    await task.save();
  });
};
