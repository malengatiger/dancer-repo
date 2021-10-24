import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
    {

        ticketID: {type: String, required: true, trim: true, index: true},
        ticketTypeAndPrice: {type: Map, required: true},
        numberOfRiders: {type: Number, required: true,default: 1, trim: true},
        user: {type: Map, required: true},
       
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        isActive: {type: Boolean, required: true, default: false},
        created: {type: String, required: true, default: new Date().toISOString()},
       
    }
);

TicketSchema.index({'ticketTypeAndPrice.associationID': 1})
TicketSchema.index({startDate: 1})
TicketSchema.index({endDate: 1})
TicketSchema.index({'ticketTypeAndPrice.routeID': 1})
TicketSchema.index({'user.userID': 1})
const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket