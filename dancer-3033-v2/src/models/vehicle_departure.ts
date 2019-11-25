import mongoose from 'mongoose';

const VehicleDepartureSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        vehicleDepartureID: {type: String, required: true, trim: true},
        landmarkID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true},
        position: {type: Map, required: true},
        vehicleType: {type: {}, required: true},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        routeID: {type: String, required: false,trim: true, index: true},
        routeName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

VehicleDepartureSchema.index({ position: "2dsphere" });
const VehicleDeparture = mongoose.model('VehicleDeparture', VehicleDepartureSchema);
export default VehicleDeparture