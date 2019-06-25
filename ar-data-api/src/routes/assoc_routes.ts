import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { RouteHelper } from "../helpers/route_helper";
import Util from "./util";

export class AssociationExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    AssociationExpressRoutes:  💙  setting up default assoc route ...`,
    );

    app.route("/addAssociation").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /associations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await AssociationHelper.addAssociation(
          req.body.name,
          req.body.email,
          req.body.cellphone,
          req.body.countryID,
          req.body.countryName,
        );
        console.log("about to return result from Helper ............");
        res.status(200).json({
          message: `🏓  🏓  🏓  association: ${req.body.name} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addAssociation failed");
      }
    });

    app.route("/getAssociations").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getAssociations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await AssociationHelper.getAssociations();
        res.status(200).json({
          message: `🏓  🏓  🏓  getAssociations OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getAssociations failed");
      }
    });
  }
}
export default AssociationExpressRoutes;
