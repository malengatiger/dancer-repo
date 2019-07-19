import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleId: {type: String, required: true, trim: true},
        associationID: {type: String, required: true, trim: true},
        associationName: {type: String, required: true},
        ownerID: {type: String, required: false, trim: true},
        ownerName: {type: String, required: false},
        vehicleType: {type: {}, required: true},
        photos: {type: Array, required: true, default: []},
        videos: {type: Array, required: true, default: []},
        vehicleLogs: {type: Array, required: true, default: []},
       
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export default Vehicle