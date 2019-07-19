import mongoose from 'mongoose';

const VehicleTypeSchema = new mongoose.Schema(
    {
        make: {type: String, required: true, trim: true},
        modelType: {type: String, required: true},
        capacity: {type: Number, required: true},
       
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleType = mongoose.model('VehicleType', VehicleTypeSchema);
export default VehicleType