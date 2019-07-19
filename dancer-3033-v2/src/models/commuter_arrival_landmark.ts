import mongoose from 'mongoose';

const CommuterArrivalLandmarkSchema = new mongoose.Schema(
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
        departureId: {type: String, required: true},
        position: {type: Map, required: true},
        userId: {type: String, required: true, trim: true},
        commuterArrivalLandmarkId: {type: String, required: true,},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterArrivalLandmark = mongoose.model('CommuterArrivalLandmark', CommuterArrivalLandmarkSchema);
export default CommuterArrivalLandmark;