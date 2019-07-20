import mongoose from 'mongoose';
import {Position} from '../models/interfaces'

const CommuterRequestSchema = new mongoose.Schema(
    {
        fromLandmarkID: {type: String, required: true},
        fromLandmarkName: {type: String, required: true},
        toLandmarkID: {type: String, required: true},
        toLandmarkName: {type: String, required: true},
        routeID: {type: String, required: true},
        routeName: {type: String, required: true},
        vehicleID: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        commuterRequestID: {type: String, required: true},
        passengers: {type: Number, required: true, default: 1},
        position: {type: Map, required: true},
        userID: {type: String, required: true, trim: true},
        stringTime: {type: String, required: true, default: new Date().toISOString()},
        time: {type: Number, required: true, default: new Date().getTime()},
        scanned: {type: Boolean, required: true, default: false},
        autoDetected: {type: Boolean, required: true, default: false},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRequest = mongoose.model('CommuterRequest', CommuterRequestSchema);
export default CommuterRequest