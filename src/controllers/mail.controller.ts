import mongoose, {Error} from "mongoose";
import Mail from "../models/mail.model";
import { Request, Response } from "express";
import User from "../models/user.model";

/**
 * GET REQUEST
 * 
 * Get all mails for a user by userId from request body that endpoint gets from auth middleware.
 * @param req Request
 * @param res Response
 */
export const getMails = async (req: Request, res: Response) => {
    const userId = req.body.userData.userId;
    try {
        const mails = await Mail.find({ user: userId });
        return res.status(200).json({ mails });
    } catch (error: Error | any) {
        return res.status(500).json({
            message: "error fetching mails",
            error: error.message,
        });
    }
};

export const getMail = async (req: Request, res: Response) => {
    const mailId = req.params.id;
    const userId = req.body.userData.userId;

    try{
        const mail = await Mail.findOne({ _id: mailId, user: userId });
        return res.status(200).json(mail);
    } catch(error: Error | any){
        return res.status(400).json({
            message: 'error fetching mail',
            error: error.message
        });
    }
}

/**
 * POST REQUEST
 * 
 * Create a new mail for a user by userId from request body that endpoint gets from auth middleware.
 * @param req Request,
 * @param res Response,
 * 
 * @var subject: string,
 * @var message: string,
 * User is taken from the userId that is in the request body from auth middleware.
 */
export const createMail = async (req: Request, res: Response) => {
    const mailPayload = req.body;
    const userId = req.body.userData.userId;
    try{
        if(!mailPayload.subject || !mailPayload.message || mailPayload.subject.length < 1 || mailPayload.message.length < 1){
            throw new Error('invalid mail payload');
        }

        const user = await User.findById(userId);
        if(!user){
            throw new Error('user with id in the token not found');
        }
        const mail = new Mail({
            user: user,
            subject: mailPayload.subject,
            message: mailPayload.message,
        });

        await mail.save();
        return res.status(201).json({message: 'mail created'});
    } catch(error: Error | any){
        return res.status(400).json({
            message: "Error creating mail",
            error: error.message
        })
    }
};

/** 
* PUT REQUEST
* 
* Update a mail by mailId from request params.
* @param req Request
* @param res Response
* Takes payload of:
* @var subject: string,
* @var message: string
**/
export const updateMail = async (req: Request, res: Response) => {
    const mailPayload = req.body;
    const mailId = req.params.id;
    const userId = req.body.userData.userId;

    try{
        if(!mailPayload.subject || !mailPayload.message || mailPayload.subject.length < 1 || mailPayload.message.length < 1){
            throw new Error('invalid mail payload');
        }

        const mail = await Mail.findOne({ _id: mailId, user: userId });
        if(!mail){
            throw new Error('mail not found');
        }

        await mail.updateOne(mailPayload);

        return res.status(200).json({message: 'mail updated'});
    } catch(error: Error | any){
        return res.status(400).json({
            message: 'error updating mail',
            error: error.message
        });
    }
};
/**
 * 
 * @param req Request
 * @param res Response
 * 
 * Takes payload of:
 * @var subject?: string,
 * @var message?: string
 */
export const patchMail = async (req: Request, res: Response) => {
    const mailPayload = req.body;
    const mailId = req.params.id;
    const userId = req.body.userData.userId;

    try{
        if(!mailPayload.subject && !mailPayload.message && mailPayload.subject.length < 1 && mailPayload.message.length < 1){
            throw new Error('invalid mail payload');
        }

        const mail = await Mail.findOne({ _id: mailId, user: userId });
        if(!mail){
            throw new Error('mail not found');
        }

        await mail.updateOne({
            subject: mailPayload.subject || mail.subject,
            message: mailPayload.message || mail.message
        });

        return res.status(200).json({message: 'mail patched'});
    } catch(error: Error | any){
        return res.status(400).json({
            message: 'error updating mail',
            error: error.message
        });
    }
};

export const deleteMail = async (req: Request, res: Response) => {
    const mailId = req.params.id;
    const userId = req.body.userData.userId;

    try{
        const mail = await Mail.findOne({_id: mailId, user: userId});
        if(!mail){
            throw new Error('mail not found');
        }
        await mail.deleteOne();
        return res.status(204).json({message: 'mail deleted'});

    } catch(error: Error | any){
        return res.status(400).json({
            message: 'error deleting mail',
            error: error.message
        });
    }
};