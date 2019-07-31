import mongoose from 'mongoose';

const VehicleTypeSchema = new mongoose.Schema(
    {
        make: {type: String, required: true, trim: true},
        model: {type: String, required: true},
        capacity: {type: Number, required: true},
        vehicleTypeID: {type: String, required: true},
       
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleType = mongoose.model('VehicleType', VehicleTypeSchema);
export default VehicleType