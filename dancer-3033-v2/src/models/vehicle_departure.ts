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
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleDeparture = mongoose.model('VehicleDeparture', VehicleDepartureSchema);
export default VehicleDeparture