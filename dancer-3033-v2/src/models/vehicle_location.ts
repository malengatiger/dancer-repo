import mongoose from 'mongoose';

//add points
const VehicleLocationSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        address: {type: String, required: false, trim: true},
        routePoints: {type: Array, required: true, default: []},
        nearestLandmarks: {type: Array, required: true, default: []},
        batteryInfo: { type: Map, required: false, default: {}  },
        position: {type: Map, required: true},
        vehicleType: {type: {}, required: true, default:{}},
        associationID: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString(), index: true},
        metadata: {type: {}, required:true, default:{}}

    }
);

VehicleLocationSchema.index({ position: "2dsphere" });
const VehicleLocation = mongoose.model('VehicleLocation', VehicleLocationSchema);
export default VehicleLocation