import { Request, Response } from "express";
import crypto from "crypto";
import db from "../database";
import { log } from "../log";
import User, { IUser } from "../models/user";
import uuid = require("uuid");
import * as admin from "firebase-admin";
import UserHelper from "../helpers/user_helper";
import Constants from "../helpers/constants";

export class UserController {
  public routes(app: any): void {
    log(`🏓    UserController: 💙  setting up default User routes ... `);
    /////////
    app.route("/getUsers").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /getUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const users: IUser[] = await User.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 getUsers failed",
        });
      }
    });
    app.route("/findUserByEmail").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /findUserByEmail requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const user: any = await User.findOne({
          email: req.body.email,
        });
        log(user);
        res.status(200).json(user);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 findUserByEmail failed",
        });
      }
    });
    app
      .route("/getUsersByAssociation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const users = await User.find({
            associationID: req.body.associationID,
          });
          res.status(200).json(users);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getUsersByAssociation failed",
          });
        }
      });
    app
      .route("/getConductorsByAssociation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /getConductorsByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const users = await User.find({
            associationID: req.body.associationID,
            userType: Constants.USER_CONDUCTOR,
          });
          res.status(200).json(users);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getConductorsByAssociation failed",
          });
        }
      });

    app.route("/userLogin").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /userLogin requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
          var hash = crypto
            .pbkdf2Sync(password, user.salt, 10000, 512, "sha512")
            .toString("hex");

          if (user.hash === hash) {
            // delete user.hash;
            // delete user.salt;

            res.status(200).json(user);
          } else {
            throw "Wrong password";
          }
        } else {
          throw "User not found";
        }
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 User login failed",
        });
      }
    });

    app.route("/addUser").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /addUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const user: IUser = new User(req.body);
        if (!req.body.userID) {
          user.userID = uuid();
        }

        user.created = new Date().toISOString();
        const result = await user.save();
        console.log("😍😍😍😍 Successfully created new user on MongoDB:");
        //create user on firebase auth ....
        await UserHelper.addUser(user);

        res.status(200).json(result);
      } catch (err) {
        console.error("addUser failed", err);
        res.status(400).json({
          error: err,
          message: " 🍎 addUser failed",
        });
      }
    });
    app.route("/updateUser").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /updateUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const userToUpdate = req.body;
        const user = await User.findOne({ userID: req.body.userID });

        if (user) {
          Object.assign(user, userToUpdate);

          if (req.body.password != null) {
            user.salt = crypto.randomBytes(16).toString("hex");
            user.hash = crypto
              .pbkdf2Sync(req.body.password, user.salt, 10000, 512, "sha512")
              .toString("hex");
          }

          const result = await user.save();
          console.log(`user updated: ${result}`);
          res.status(200).json(result);
        } else {
          res.status(400).json({
            message: " 🍎 updateUser failed: User not found",
          });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: err,
          message: " 🍎 updateUser failed",
        });
      }
    });
    app.route("/deleteUser").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /deleteUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        await User.deleteOne({ userID: req.body.userID });
        await UserHelper.deleteUser(req.body.userID);
        res.status(200).json({
          message: `User deleted from both mongo & firebase auth: ${req.body.userID}`,
        });
      } catch (err) {
        console.log(err, "deleteUser failed");
        res.status(400).json({
          error: err,
          message: " 🍎 deleteUser failed",
        });
      }
    });
  }
}

export default UserController;
