import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export default function checkAuth(req : Request, res : Response, next: NextFunction){
    try{
        const token = req.cookies.token;
        if(!token){
            throw new Error('no token provided in the cookie request');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.body.userData = decodedToken;
        next();
    }catch(err : any){
        return res.status(401).json({
            message: "authentiaction failed, please use login post endpoint",
            error: err.message
        });
    }
}