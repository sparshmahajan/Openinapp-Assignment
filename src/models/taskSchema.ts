import mongoose, { ObjectId, Types } from "mongoose";
import { TaskStatusEnums } from "../enums/taskStatusEnum";
import { taskPriorityCalculation } from "../common/taskPriorityCalculation";

interface TaskAttrs {
  title: string;
  description: string;
  due_date: Date;
}

interface TaskModel extends mongoose.Model<TaskDoc> {
  build(attrs: TaskAttrs): TaskDoc;
}

export interface TaskDoc extends mongoose.Document {
  id: ObjectId;
  title: string;
  description: string;
  status: TaskStatusEnums;
  due_date: Date;
  priority: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const taskSchema = new mongoose.Schema<TaskDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        TaskStatusEnums.TODO,
        TaskStatusEnums.IN_PROGRESS,
        TaskStatusEnums.DONE,
      ],
      default: TaskStatusEnums.TODO,
    },
    due_date: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["0", "1-2", "3-4", "5+"],
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);


taskSchema.pre("save", async function (done) {
  if (this.isModified("due_date")) {
    const priority = taskPriorityCalculation(this.get("due_date"));
    this.set("priority", priority);
  }
  done();
});


taskSchema.statics.build = async (attrs: TaskAttrs) => {
  const priority = taskPriorityCalculation(attrs.due_date);

  const task = new Task({
    ...attrs,
    priority,
  });
  await task.save();
  return task.toJSON();
};

const Task = mongoose.model<TaskDoc, TaskModel>("task", taskSchema);

export { Task };
