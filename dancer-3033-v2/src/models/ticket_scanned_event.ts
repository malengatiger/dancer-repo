import mongoose from "mongoose";

const TicketScannedEventSchema = new mongoose.Schema({
  ticketScannedEventID: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  scannedBy: { type: String, required: true },
  userID: { type: String, required: true },
  landmarkID: { type: String, required: false },
  landmarkName: { type: String, required: false },

  vehicleID: { type: String, required: false },
  vehicleReg: { type: String, required: false },
  ticket: { type: Map, required: true },
  position: { type: Map, required: true },
  date: { type: String, required: true, default: new Date().toISOString() },
});

TicketScannedEventSchema.index({ associationID: 1 });
TicketScannedEventSchema.index({ vehicleID: 1 });
TicketScannedEventSchema.index({ "ticket.ticketID": 1 });
TicketScannedEventSchema.index({ landmarkID: 1 });
TicketScannedEventSchema.index({ userID: 1 });
TicketScannedEventSchema.index({ scannedBy: 1 });
TicketScannedEventSchema.index({ "ticket.routeID": 1 });
TicketScannedEventSchema.index({ date: 1 });
TicketScannedEventSchema.index({ position: "2dsphere" });

const TicketScannedEvent = mongoose.model(
  "TicketScannedEvent",
  TicketScannedEventSchema
);
export default TicketScannedEvent;
