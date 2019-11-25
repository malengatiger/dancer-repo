import mongoose from 'mongoose';

const VehicleLocationSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        position: {type: Map, required: true},
        vehicleType: {type: {}, required: true},
        associationID: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString(), index: true},

    }
);

VehicleLocationSchema.index({ position: "2dsphere" });
const VehicleLocation = mongoose.model('VehicleLocation', VehicleLocationSchema);
export default VehicleLocation