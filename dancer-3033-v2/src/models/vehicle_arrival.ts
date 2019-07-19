import mongoose from 'mongoose';

const VehicleArrivalSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleId: {type: String, required: true, trim: true},
        landmarkId: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true},
        position: {type: Map, required: true},
        dateArrived: {type: String, required: true, default: new Date().toISOString()},
        vehicleType: {type: {}, required: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleArrival = mongoose.model('VehicleArrival', VehicleArrivalSchema);
export default VehicleArrival