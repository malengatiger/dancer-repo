import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
    {
        commuterID: {type: String, required: true, trim: true},
        driverID: {type: String, required: false, trim: true},
        marshalID: {type: String, required: false, trim: true},
        ownerID: {type: String, required: false, trim: true},

        routeID: {type: String, required: true, trim: true},
        routeName: {type: String, required: true, trim: true},

        vehicleID: {type: String, required: false, trim: true},
        vehicleReg: {type: String, required: false, trim: true},
        discounted: {type: Boolean, required: true, default: false, trim: true},

        commuterRequestID: {type: String, required: false},

        passengers: {type: Number, required: true, default: 0},
        position: {type: Map, required: true},
        amount: {type: Number, required: true, trim: true},
        
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

PaymentSchema.index({ position: "2dsphere" });
const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment