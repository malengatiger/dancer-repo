import mongoose from 'mongoose';
import { Position } from './interfaces';

const VehicleLocationSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleId: {type: String, required: true, trim: true},
        position: {type: Position, required: true},
        vehicleType: {type: {}, required: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleLocation = mongoose.model('VehicleLocation', VehicleLocationSchema);
export default VehicleLocation