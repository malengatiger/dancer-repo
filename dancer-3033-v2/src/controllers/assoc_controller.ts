import { Request, Response } from "express";
import db from '../database';
import log from '../log';
import Association from "../models/association";
export class AssociationController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓🏓🏓    AssociationController: 💙  setting up default Association routes ... `,
        );
        /////////
        app.route("/getAssociations").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getAssociations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const asses = await Association.find();
                res.status(200).json(asses);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getRoutes failed'
                    }
                )
            }
        });

        app.route("/addAssociation").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const association: any = new Association(req.body);
                const result0 = await association.save();
                association.associationID = result0._id;
                const result = await association.save();
                log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addAssociation failed'
                    }
                )
            }
        });
    }
}

export default AssociationController;