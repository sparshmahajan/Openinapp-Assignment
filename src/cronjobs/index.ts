import { CronJob } from "cron";
import { changePriorityJob } from "./changePriorityJob";
import { callUserJob } from "./callUserJob";

const changePriorityJobInstance = new CronJob(
  "0 0 * * *",
  changePriorityJob,
  null,
  true,
  "UTC"
);
const callUserJobInstance = new CronJob(
  "0 0 * * *",
  callUserJob,
  null,
  true,
  "UTC"
);

export const cronJobs = () => {
  changePriorityJobInstance.start();
  callUserJobInstance.start();
};
