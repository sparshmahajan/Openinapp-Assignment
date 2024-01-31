import { User, UserDoc } from "../models/userSchema";
import { Task, TaskDoc } from "../models/taskSchema";
import { callUser } from "../common/callUser";
import { jsonDb } from "../config/jsonDb";

const callUserSubTask = async (
  task: TaskDoc,
  user: UserDoc
): Promise<boolean> => {
  await callUser(user.phone_number, task.title);

  return new Promise((resolve) => {
    const callInterval = setInterval(async () => {
      if (jsonDb.get("callPicked") === 1) {
        clearInterval(callInterval);
        resolve(true);
      } else if (jsonDb.get("callPicked") === -1) {
        clearInterval(callInterval);
        resolve(false);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(callInterval);
      resolve(false);
    }, 30000);
  });
};

export const callUserJob = async () => {
  const users = await User.find({}).sort({ priority: 1 });

  const tasks = await Task.find({
    due_date: {
      $lte: new Date(),
    },
    status: ["TODO", "IN_PROGRESS"],
  });

  const tasksLength = tasks.length;

  for (let i = 0; i < tasksLength; i++) {
    jsonDb.set("callPicked", 0);
    const task = tasks[i];
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
      const callUserResult = await callUserSubTask(task, user);
      if (callUserResult) {
        break;
      }
    }
  }
};
