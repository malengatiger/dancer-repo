import mongoose from 'mongoose';

const CommuterArrivalLandmarkSchema = new mongoose.Schema(
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
        departureID: {type: String, required: true},
        position: {type: Map, required: true},
        userID: {type: String, required: true, trim: true},
        commuterArrivalLandmarkID: {type: String, required: true,},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterArrivalLandmark = mongoose.model('CommuterArrivalLandmark', CommuterArrivalLandmarkSchema);
export default CommuterArrivalLandmark;