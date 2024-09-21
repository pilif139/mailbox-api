import mongoose, { Error } from 'mongoose';
import User from '../models/user.model';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/**
 * Register a new user.
 * @param req Request
 * @param res Response
 * Takes payload of:
 * @var firstName: string,
 * @var lastName: string,
 * @var email: string,
 * @var password: string
 * 
 */
export const RegisterUser = async (req: Request,res: Response)=>{
    const userPayload = req.body;

    if(!userPayload.firstName || !userPayload.lastName || !userPayload.email || !userPayload.password){
        return res.status(400).json({message: 'invalid user payload'});
    }

    if(userPayload.password.length < 6 || userPayload.password.length > 35){
        return res.status(400).json({message: 'password length must be between 6 and 35 characters'});
    }

    try {
        const password = await bcrypt.hash(userPayload.password, 10);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            firstName: userPayload.firstName,
            lastName: userPayload.lastName,
            email: userPayload.email,
            password: password
        });

        await user.save();

        const token = jwt.sign(
            {email: user.email, userId: user._id}
            , process.env.JWT_SECRET_KEY as string,
            {expiresIn: 7 * 24 * 60 * 60}
        );

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});

        return res.status(201).json({message: 'user created'});
    } catch (error: Error | any) {
        return res.status(500).json({
            message: 'error creating user in the database',
            error: error.message
        });
    }
}

export const LoginUser = async (req: Request,res: Response)=>{
    const loginPayload = req.body;
    if(!loginPayload.email || !loginPayload.password){
        return res.status(400).json({message: 'invalid user login payload'});
    }
    try{
        const user= await User.findOne({email: loginPayload.email}).exec()
        if(!user){
            return res.status(404).json({message: 'invalid email'});
        }
        const isPasswordValid = await bcrypt.compare(loginPayload.password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'invalid password'});
        }

        const token = jwt.sign(
            {email: user.email, userId: user._id}
            , process.env.JWT_SECRET_KEY as string,
            {expiresIn: 7 * 24 * 60 * 60}
        );

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});

        return res.status(200).json({message: 'user logged in'});
    } catch(error: Error | any){
        return res.status(500).json({
            message: 'error logging in user',
            error: error.message
        });
    }

};