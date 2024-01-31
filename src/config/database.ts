import mongoose, { connect } from "mongoose";

mongoose.set("strictQuery", true);

const db = {
  connect: async (mongoURL: string) => {
    connect(mongoURL);
    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error: " + err);
      process.exit(-1);
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
  },
};

export { db };
