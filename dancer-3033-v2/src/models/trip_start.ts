import mongoose from 'mongoose';

const TripStartSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        landmarkID: {type: String, required: false, trim: true},
        tripStartID: {type: String, required: true, trim: true},
        userID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: false, trim: true},
        position: {type: Map, required: true},
        vehicleType: {type: {}, required: true},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        routeID: {type: String, required: true,trim: true, index: true},
        routeName: {type: String, required: true,trim: true},
        dispatched: {type: Boolean, required: false, default: false},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

TripStartSchema.index({ position: "2dsphere" });
const TripStart = mongoose.model('TripStart', TripStartSchema);
export default TripStart