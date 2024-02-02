import { User, UserDoc } from "../models/userSchema";
import { Task, TaskDoc } from "../models/taskSchema";
import { callUser } from "../common/callUser";
import { jsonDb } from "../config/jsonDb";
import { TaskStatusEnums } from "../enums/taskStatusEnum";

const callUserSubTask = async (
  user: UserDoc,
  dueTasks: number
): Promise<boolean> => {
  await callUser(user.phone_number, dueTasks);

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

  const tasksCount = await Task.find({
    due_date: {
      $lte: new Date(),
    },
    status: {
      $ne: TaskStatusEnums.DONE,
    },
  }).countDocuments();

  for (let i = 0; i < users.length; i++) {
    jsonDb.set("callPicked", 0);
    const user = users[i];

    const callUserResult = await callUserSubTask(user, tasksCount);
    if (callUserResult) {
      break;
    }
  }
};
