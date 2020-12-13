import { Request, Response } from "express";
import uuid from 'uuid/v1';
import Association from "../models/association";
import { log } from "../log";
export class AssociationController {
    public routes(app: any): void {
        log(
            `🏓    AssociationController: 💙  setting up default Association routes ... `,
        );
        /////////
        app.route("/getAssociations").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getAssociations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const asses = await Association.find();
                log(`🍎🍎🍎🍎 getAssociations found :${asses.length} asses :)`)
                res.status(200).json(asses);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 getAssociations failed:${err}`
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
                association.associationID = uuid();
                association.created = new Date().toISOString();
                const result = await association.save();
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 addAssociation failed:${err}`
                    }
                )
            }
        });
    }
}

export default AssociationController;