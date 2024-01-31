import { Response } from "express";

export class EntryFoundHandler {
    private res: Response;
    private data: any;
    private message: string;
    private statusCode = 200;
    constructor(
        res: Response,
        message: string,
        data: any,
    ) {
        this.res = res;
        this.message = message;
        this.data = data;
        this.send();
    }

    private send() {
        this.res.status(this.statusCode).json({
            message: this.message,
            ...this.data,
        });
    }
}