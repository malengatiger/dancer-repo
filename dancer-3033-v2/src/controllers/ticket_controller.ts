import { Request, Response } from "express";
import { log } from "../log";
import Ticket from "../models/ticket";
import TicketScannedEvent from "../models/ticket_scanned_event";
import TicketTypeAndPrice from "../models/ticket_type_price";

export class TicketController {
  public routes(app: any): void {
    console.log(
      `🏓    TicketController:  💙  setting up default TicketController ...`
    );

    // Before any tickets can be created, the association must create the types first
    app.route("/addTicketTypeAndPrice").post(async (req: Request, res: Response) => {
      try {
        const c: any = new TicketTypeAndPrice(req.body);
        c.date = new Date().toISOString();
        const result = await c.save();
        console.log(`🍎 TicketTypeAndPrice added to the database`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 addTicketTypeAndPrice failed: ${err}`,
        });
      }
    });


    app.route("/addTicket").post(async (req: Request, res: Response) => {
      try {
        const c: any = new Ticket(req.body);
        c.created = new Date().toISOString();
        const result = await c.save();
        console.log(`🍎 Ticket added to the database`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 addTicket failed: ${err}`,
        });
      }
    });

    app.route("/addTicketScannedEvent").post(async (req: Request, res: Response) => {
      try {
        const c: any = new TicketScannedEvent(req.body);
        c.date = new Date().toISOString();
        const result = await c.save();
        console.log(`🍎 TicketScannedEvent added to the database`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 addTicketScannedEvent failed: ${err}`,
        });
      }
    });

    app.route("/deactivateTicket").post(async (req: Request, res: Response) => {
      try {
        const ticket: any = await Ticket.findOne({
          ticketID: req.body.ticketID,
        });

        if (ticket) {
          ticket.isActive = false;
          const result = ticket?.save;
          log(`🍎 🍎 Ticket deactivated `);
          res.status(200).json(result);
        }
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 deactivateTicket failed: ${err}`,
        });
      }
    });

    app
      .route("/getTicketsByAssociation")
      .post(async (req: Request, res: Response) => {
        const msg = ` getTicketsByAssociation requested `;
        console.log(msg);
        try {
          const tickets = await Ticket.find({
            associationID: req.body.associationID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(tickets);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsByAssociation failed: ${err}`,
          });
        }
      });

      app
      .route("/getTicketTypesByAssociation")
      .post(async (req: Request, res: Response) => {
        
        try {
          const tickets = await TicketTypeAndPrice.find({
            associationID: req.body.associationID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(tickets);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketTypesByAssociation failed: ${err}`,
          });
        }
      });

      app
      .route("/getTicketsByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const tickets = await Ticket.find({
            routeID: req.body.routeID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(tickets);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsByRoute failed: ${err}`,
          });
        }
      });

      app
      .route("/getTicketTypesByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const tickets = await TicketTypeAndPrice.find({
            routeID: req.body.routeID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(tickets);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketTypesByRoute failed: ${err}`,
          });
        }
      });

      app
      .route("/getTicketsByUser")
      .post(async (req: Request, res: Response) => {
        try {
          const tickets = await Ticket.find({
            'user.userID': req.body.userID,
          });
          res.status(200).json(tickets);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsByUser failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByAssociation")
      .post(async (req: Request, res: Response) => {
        const msg = ` getTicketsScannedByAssociation requested `;
        console.log(msg);
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            associationID: req.body.associationID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByAssociation failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            vehicleID: req.body.vehicleID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByVehicle failed: ${err}`,
          });
        }
      });

      app
      .route("/getTicketsScannedByVehicleList")
      .post(async (req: Request, res: Response) => {
        try {
          const list: any[] = req.body.vehicleIDs
          const ticketsScanned = await TicketScannedEvent.find({
            vehicleID: {$in: list},
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByVehicleList failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByUser")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            userID: req.body.userID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByUser failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByScanner")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            scannedBy: req.body.userID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByScanner failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            "ticket.routeID": req.body.routeID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByRoute failed: ${err}`,
          });
        }
      });

    app
      .route("/getTicketsScannedByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            landmarkID: req.body.landmarkID,
            date: { $gte: req.body.date },
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByLandmark failed: ${err}`,
          });
        }
      });

    app.route("/getByLocation").post(async (req: Request, res: Response) => {
      try {
        const ticketsScanned = await TicketScannedEvent.find({
          landmarkID: req.body.landmarkID,
          date: { $gte: req.body.date },
        });
        res.status(200).json(ticketsScanned);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `🍎 getTicketsScannedByLandmark failed: ${err}`,
        });
      }
    });
    app
      .route("/findTicketsScannedByLocation")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const result = await TicketScannedEvent.find({
            date: { $gte: req.body.date },
            position: {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
            },
          });

          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query; found ${result.length} cities`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 findTicketsScannedByLocation failed",
          });
        }
      });

    app
      .route("/getTicketsScannedByID")
      .post(async (req: Request, res: Response) => {
        try {
          const ticketsScanned = await TicketScannedEvent.find({
            "ticket.ticketID": req.body.ticketID,
          });
          res.status(200).json(ticketsScanned);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 getTicketsScannedByID failed: ${err}`,
          });
        }
      });
  }
}
