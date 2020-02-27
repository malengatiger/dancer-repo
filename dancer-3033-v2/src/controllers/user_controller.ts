import { Request, Response } from "express";
import crypto from 'crypto'
import db from '../database';
import {log} from '../log';
import User, { IUser } from "../models/user";
import uuid = require("uuid");
import Notification from "../models/notification";
const userTypes = ['Staff', 'Owner', 'Administrator', 'Driver', 'Marshal', 'Patroller'];
export class UserController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓    UserController: 💙  setting up default User routes ... `,
        );
        /////////
        app.route("/getUsers").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const users: IUser[] = await User.find();
                res.status(200).json(users);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getUsers failed'
                    }
                )
            }
        });
        app.route("/findUserByEmail").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /findUserByEmail requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const user: any = await User.findOne({
                    email: req.body.email,
                });
                log(user);
                res.status(200).json(user);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 findUserByEmail failed'
                    }
                )
            }
        });
        app.route("/getUsersByAssociation").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const users = await User.find({
                    associationID: req.body.associationID,
                });
                res.status(200).json(users);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getUsersByAssociation failed'
                    }
                )
            }
        });
        app.route("/notifications").post(async (req: Request, res: Response) => {
            try {
                const notifications = await Notification.find()
                res.status(200).json(notifications)
            } catch (err) {
                res.status(400).json(err)
            }
        })
        app.route("/addNotification").post(async (req: Request, res: Response) => {
            try {
                const notification = new Notification(req.body)
                const result = await notification.save()
                res.status(200).json(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })
        app.route("/userLogin").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /userLogin requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const {email, password} = req.body
                const user = await User.findOne({email: email})

                if (user) {
                    var hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');

                    if (user.hash === hash) {
                        delete user.hash
                        delete user.salt

                        res.status(200).json(user)
                    } else {
                        throw 'Wrong password'
                    }
                } else {
                    throw 'User not found'
                }
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 User login failed'
                    }
                )
            }
        })

        app.route("/addUser").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const user: IUser = new User(req.body);
                if (req.body.userID) {
                    user.userID = req.body.userID;
                } else {
                    user.userID = uuid();
                }
                
                user.created = new Date().toISOString();
                const result = await user.save();
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addUser failed'
                    }
                )
            }
        });
        app.route("/updateUser").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /updateUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const userToUpdate = req.body;
                const user = await User.findOne({userID: req.body.userID})

                if (user) {
                    Object.assign(user, userToUpdate)

                    if (req.body.password != null) {
                        user.salt = crypto.randomBytes(16).toString('hex');
                        user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 10000, 512, 'sha512').toString('hex');
                    }

                    const result = await user.save();
                    // log(result);
                    res.status(200).json(result);
                } else {
                    throw 'User not found'
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

export default UserController;