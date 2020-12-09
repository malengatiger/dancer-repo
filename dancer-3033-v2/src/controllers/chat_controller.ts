import { Request, Response } from "express";
import crypto from 'crypto'
import db from '../database';
import uuid = require("uuid");
import ChatObject from '../models/chat'
import {log} from "../log";


export class ChatController {
    public routes(app: any): void {
        log(
            `🏓    ChatController: 💙  setting up messages for live chat ... `,
        );
        /////////
        
        app.route("/getChatMessagesByAssociation").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getMessagesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const messages = await ChatObject.find({
                    associationID: req.body.associationID,
                });
                res.status(200).json(messages);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getMessagesByAssociation failed'
                    }
                )
            }
        });

        app.route("/sendChatMessage").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /sendMessage requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const user: any = new ChatObject(req.body);
                user.created = new Date().toISOString();
                const result = await user.save();
                // log(result);
                res.status(200).json(result);
              } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addMessage failed'
                    }
                )
            }
        });

        app.route("/updateChatMessageRead").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /updateMessageRead requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const messageToUpdate = req.body;
                const message = await ChatObject.findOne({associationID: req.body.associationID})

                if (message) {
                    Object.assign(message, messageToUpdate)
                    const result = await message.save();
                    // log(result);
                    res.status(200).json(result);
                } else {
                    throw 'message not found'
                }
                
            } catch (err) {
                console.log(err)
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 updateUser failed'
                    }
                )
            }
        });
    }
}

export default ChatController; 