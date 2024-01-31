import mongoose, { ObjectId } from "mongoose";
import { SubTaskStatusEnums } from "../enums/subTaskStatusEnum";

interface SubTaskAttrs {
  task_id: string;
}

interface SubTaskModel extends mongoose.Model<SubTaskDoc> {
  build(attrs: SubTaskAttrs): SubTaskDoc;
}

export interface SubTaskDoc extends mongoose.Document {
  task_id: ObjectId;
  status: SubTaskStatusEnums;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const subTaskSchema = new mongoose.Schema<SubTaskDoc>(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "task",
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
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

subTaskSchema.statics.build = async (attrs: SubTaskAttrs) => {
  const subTask = new SubTask(attrs);
  await subTask.save();
  return subTask.toJSON();
};

const SubTask = mongoose.model<SubTaskDoc, SubTaskModel>(
  "subTask",
  subTaskSchema
);

export { SubTask };
