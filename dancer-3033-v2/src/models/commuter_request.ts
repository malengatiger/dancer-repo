import mongoose from 'mongoose';
import {Position} from '../models/interfaces'

const CommuterRequestSchema = new mongoose.Schema(
    {
        fromLandmarkId: {type: String, required: true},
        fromLandmarkName: {type: String, required: true},
        toLandmarkId: {type: String, required: true},
        toLandmarkName: {type: String, required: true},
        routeId: {type: String, required: true},
        routeName: {type: String, required: true},
        vehicleId: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        commuterRequestId: {type: String, required: true},
        passengers: {type: Number, required: true, default: 1},
        position: {type: Map, required: true},
        userId: {type: String, required: true, trim: true},
        stringTime: {type: String, required: true, default: new Date().toISOString()},
        time: {type: Number, required: true, default: new Date().getTime()},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRequest = mongoose.model('CommuterRequest', CommuterRequestSchema);
export default CommuterRequest