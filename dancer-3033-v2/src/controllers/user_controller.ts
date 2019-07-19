import { Request, Response } from "express";
import db from '../database';
import log from '../log';
import User from "../models/user";
export class UserController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓🏓🏓    UserController: 💙  setting up default User routes ... ${db}`,
        );
        /////////
        app.route("/getUsers").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const users = await User.find();
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
                const user = await User.findOne({
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

        app.route("/addUser").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const user: any = new User(req.body);
                const result = await user.save();
                log(result);
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
    }
}

export default UserController;