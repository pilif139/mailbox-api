import { NextFunction, Request, Response } from "express";

export default function errorHandler(err: Error, req: Request, res :Response, next : NextFunction) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        // stack: err.stack
    });
}