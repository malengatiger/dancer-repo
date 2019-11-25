import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const VehicleSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true, unique: true},
        vehicleID: {type: String, required: true, trim: true},
        associationID: {type: String, required: true, trim: true},
        associationName: {type: String, required: true},
        ownerID: {type: String, required: false, trim: true},
        ownerName: {type: String, required: false},
        vehicleType: {type: Map, required: true},
        photos: {type: Array, required: true, default: []},
        videos: {type: Array, required: true, default: []},
       
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);
VehicleSchema.plugin(uniqueValidator);
VehicleSchema.index({vehicleReg: 1}, {unique: true})
const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export default Vehicle