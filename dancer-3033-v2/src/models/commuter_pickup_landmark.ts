import mongoose from 'mongoose';

const CommuterPickupandmarkSchema = new mongoose.Schema(
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
        // departureID: {type: String, required: true},
        position: {type: Map, required: true},
        userID: {type: String, required: true, trim: true},
        commuterPickupLandmarkID: {type: String, required: true,},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

CommuterPickupandmarkSchema.index({ position: "2dsphere" });
const CommuterPickupLandmark = mongoose.model('CommuterPickupLandmark', CommuterPickupandmarkSchema);
export default CommuterPickupLandmark;