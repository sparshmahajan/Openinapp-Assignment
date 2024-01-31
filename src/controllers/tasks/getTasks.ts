import { Request, Response } from "express";
import { Task, TaskDoc } from "../../models/taskSchema";
import { FilterQuery } from "mongoose";
import { EntriesFoundHandler } from "../../handlers/responses";

export const getTasks = async (req: Request, res: Response) => {
  const { priority, due_date } = req.query as {
    priority?: string;
    due_date?: Date;
  };

  const page = req.query.page
    ? parseInt(req.query.page as string) > 0
      ? parseInt(req.query.page as string)
      : 1
    : 1;

  const limit = req.query.limit
    ? parseInt(req.query.limit as string) > 0
      ? parseInt(req.query.limit as string)
      : 10
    : 10;
  const skip = (page - 1) * limit;

  const filterQuery: FilterQuery<TaskDoc> = {
    deleted_at: {
      $exists: false,
    },
  };

  if (priority) {
    filterQuery.priority = priority;
  }

  if (due_date) {
    filterQuery.due_date = due_date;
  }

  const tasks = await Task.find(filterQuery)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  const totalDocuments = await Task.countDocuments(filterQuery);

  new EntriesFoundHandler(res, "Tasks found successfully", {
    tasks,
    page,
    limit,
    totalDocuments,
  });
};
