import mongoose from 'mongoose';

const VehicleArrivalSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        landmarkID: {type: String, required: true, trim: true},
        vehicleArrivalID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true},
        position: {type: Map, required: true},
        vehicleType: {type: {}, required: true},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        routeID: {type: String, required: false,trim: true, index: true},
        routeName: {type: String, required: false,trim: true},
        dispatched: {type: Boolean, required: true, default: false},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

VehicleArrivalSchema.index({ position: "2dsphere" });
const VehicleArrival = mongoose.model('VehicleArrival', VehicleArrivalSchema);
export default VehicleArrival