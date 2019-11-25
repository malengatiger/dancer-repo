import mongoose from 'mongoose';

const CommuterArrivalLandmarkSchema = new mongoose.Schema(
    {
        fromLandmarkID: {type: String, required: true},
        fromLandmarkName: {type: String, required: true},
        toLandmarkID: {type: String, required: true},
        toLandmarkName: {type: String, required: true},
        routeID: {type: String, required: false},
        routeName: {type: String, required: false},
        vehicleID: {type: String, required: false},
        vehicleReg: {type: String, required: false},
        commuterRequestID: {type: String, required: false},
        departureID: {type: String, required: false},
        position: {type: Map, required: true,},
        userID: {type: String, required: true, trim: true},
        commuterArrivalLandmarkID: {type: String, required: true,},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

CommuterArrivalLandmarkSchema.index({ position: "2dsphere" });
const CommuterArrivalLandmark = mongoose.model('CommuterArrivalLandmark', CommuterArrivalLandmarkSchema);
export default CommuterArrivalLandmark;