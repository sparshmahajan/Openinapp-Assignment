import { Request, Response } from "express";
import { Task } from "../../models/taskSchema";
import { ActionSuccessHandler } from "../../handlers/responses";

export const createTask = async (req: Request, res: Response) => {
  const { title, description, due_date } = req.body as {
    title: string;
    description: string;
    due_date: Date;
  };

  const task = await Task.build({
    title,
    description,
    due_date,
  });

  new ActionSuccessHandler(res, "Task created successfully", task, 201);
};
