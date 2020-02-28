import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const VehicleSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true, unique: true},
        vehicleID: {type: String, required: true, trim: true, unique: true, index: true},
        associationID: {type: String, required: true, trim: true},
        associationName: {type: String, required: true},
        ownerID: {type: String, required: false, trim: true},
        ownerName: {type: String, required: false},
        vehicleType: {type: Map, required: true},
        photos: {type: Array, required: true, default: []},
        videos: {type: Array, required: true, default: []},
        assignments: {type: Array, required: true, default: []},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);
VehicleSchema.plugin(uniqueValidator);
VehicleSchema.index({vehicleID: 1}, {unique: true})
VehicleSchema.index({associationID: 1}, {unique: false})
VehicleSchema.index({ownerID: 1}, {unique: false})
const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export default Vehicle