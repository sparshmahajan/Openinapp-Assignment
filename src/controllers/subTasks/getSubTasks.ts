import { Request, Response } from "express";
import { SubTask, SubTaskDoc } from "../../models/subTaskSchema";
import { FilterQuery, Types } from "mongoose";
import { EntriesFoundHandler } from "../../handlers/responses";

export const getSubTasks = async (req: Request, res: Response) => {
  const { task_id } = req.query as {
    task_id?: string;
  };

  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const skip = (page - 1) * limit;

  const filterQuery: FilterQuery<SubTaskDoc> = {
    deleted_at: {
      $exists: false,
    },
  };

  if (task_id) {
    filterQuery.task_id = new Types.ObjectId(task_id);
  }

  const subTasks = await SubTask.find(filterQuery)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  const totalDocuments = await SubTask.countDocuments(filterQuery);

  new EntriesFoundHandler(res, "Tasks found successfully", {
    subTasks,
    page,
    limit,
    totalDocuments,
  });
};
