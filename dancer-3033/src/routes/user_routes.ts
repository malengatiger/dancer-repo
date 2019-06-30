import { Request, Response } from "express";
import { UserHelper } from "../helpers/user_helper";
import Util from "../util";

export class UserExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    UserExpressRoutes:  💙  setting up default User Routes ...`,
    );

    app.route("/addUser").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /Users requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await UserHelper.addUser(
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          req.body.cellphone,
          req.body.userType,
          req.body.associationId,
        );
        console.log("about to return result from Helper ............");
        res.status(200).json({
          message: `🏓  🏓  🏓  User: ${
            req.body.firstName
          } : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addUser failed");
      }
    });

    app.route("/getAllUsers").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getAllUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await UserHelper.getAllUsers();
        res.status(200).json({
          message: `🏓  🏓  🏓  getAllUsers OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getAllUsers failed");
      }
    });
    app
      .route("/getUsersByAssociation")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await UserHelper.getUsersByAssociation(
            req.body.associationId,
          );
          res.status(200).json({
            message: `🏓  🏓  🏓  getUsersByAssociation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "getUsersByAssociation failed");
        }
      });
    app.route("/getUserById").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getUserById requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await UserHelper.getUserById(req.body.userId);
        res.status(200).json({
          message: `🏓  🏓  🏓  getUserById OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getUserById failed");
      }
    });
  }
}
export default UserExpressRoutes;
