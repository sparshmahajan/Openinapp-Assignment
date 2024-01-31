import { app } from "./config/app";
require("dotenv").config();
import { db } from "./config/database";
import { cronJobs } from "./cronjobs";
import { callUser } from "./common/callUser";
import { callUserJob } from "./cronjobs/callUserJob";

const start = async () => {
  const port = process.env.PORT || 3000;
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be defined");
  }

  try {
    await db.connect(process.env.MONGO_URL);
    cronJobs();
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
