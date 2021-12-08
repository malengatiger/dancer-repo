import mongoose from "mongoose";

const TicketTypeAndPriceSchema = new mongoose.Schema({


  ticketTypeID: { type: String, required: true, trim: true, index: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  routeID: { type: String, required: true },
  routeName: { type: String, required: true },
  associationID: { type: String, required: true },
  associationName: { type: String, required: true },
  date: { type: String, required: true, default: new Date().toISOString() },
});

TicketTypeAndPriceSchema.index({ associationID: 1 });
TicketTypeAndPriceSchema.index({ routeID: 1 });
const TicketTypeAndPrice = mongoose.model(
  "TicketTypeAndPrice",
  TicketTypeAndPriceSchema
);
export default TicketTypeAndPrice;
