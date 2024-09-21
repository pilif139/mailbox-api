import { NextFunction, Request, Response } from "express";

export default function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`route: ${req.originalUrl} - not found`);
    next(error);
}