import { Request, Response } from "express";
import uuid from "uuid/v1";
import Association from "../models/association";
import { log } from "../log";
import SettingsModel from "../models/settings";
import association from "../models/association";
import PeakItem from "../models/peak_item";
export class AssociationController {
  public routes(app: any): void {
    log(
      `🏓    AssociationController: 💙  setting up default Association routes ... `
    );
    /////////
    app.route("/getAssociations").post(async (req: Request, res: Response) => {
      try {
        const asses = await Association.find();
        log(`🍎 getAssociations found :${asses.length} asses :)`);
        res.status(200).json(asses);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 getAssociations failed:${err}`,
        });
      }
    });
    async function writePeak(peakItem: any): Promise<any> {
      const item: any = new PeakItem(peakItem);
      item.created = new Date().toISOString();
      const result = await item.save();
      return result;
    }
    app.route("/getAssociationPeakItems").post(async (req: Request, res: Response) => {
      try {
        const asses = await PeakItem.find({associationID: req.body.associationID});
        log(`🍎 getAssociationPeakItems found :${asses.length} items :)`);
        res.status(200).json(asses);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 getAssociationPeakItems failed:${err}`,
        });
      }
    });

    app.route("/addAssociationPeakItems").post(async (req: Request, res: Response) => {
      try {
        await PeakItem.deleteMany({associationID: req.body.associationID})
        const results: any[] = []
        const items: any[] = req.body.items
        for (const item of items) {
          const result = await writePeak(item)
          results.push(result);
        }

        res.status(200).json(results);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 addAssociationPeakItem failed:${err}`,
        });
      }
    });

    app.route("/addAssociation").post(async (req: Request, res: Response) => {
      try {
        const association: any = new Association(req.body);
        association.associationID = uuid();
        association.created = new Date().toISOString();
        const result = await association.save();
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 addAssociation failed:${err}`,
        });
      }
    });
    app.route("/addSettingsModel").post(async (req: Request, res: Response) => {
      try {
        const c: any = new SettingsModel(req.body);
        c.created = new Date().toISOString();
        const result = await c.save();

        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎 addSettingsModel failed",
        });
      }
    });

    app.route("/getSettingsModel").post(async (req: Request, res: Response) => {
      try {
        const result = await SettingsModel.find({
          associationID: req.body.associationID,
        }).sort({ created: "descending" });
        log(`🍎 getSettingsModel found :${result.length} settings models :)`);
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res
            .status(400)
            .json({ message: "Association SettingsModel not found" });
        }
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 getAssociations failed:${err}`,
        });
      }
    });
  }
}

export default AssociationController;
