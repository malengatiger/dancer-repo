import mongoose from 'mongoose';

const CommuterRequestSchema = new mongoose.Schema(
    {
        fromLandmarkID: {type: String, required: true, trim: true},
        fromLandmarkName: {type: String, required: true, trim: true},
        toLandmarkID: {type: String, required: true, trim: true},
        toLandmarkName: {type: String, required: true, trim: true},
        routeID: {type: String, required: false, trim: true},
        routeName: {type: String, required: false, trim: true},
        vehicleID: {type: String, required: false, trim: true},
        vehicleReg: {type: String, required: false, trim: true},
        commuterRequestID: {type: String, required: true, index: true, trim: true},
        fcmToken: {type: String, required: true, trim: true},
        passengers: {type: Number, required: true, default: 1},
        position: {type: Map, required: true},
        userID: {type: String, required: false, trim: true},
        stringTime: {type: String, required: false},
        time: {type: Number, required: true},
        fare: {type: Number, required: true, default: 0.00},
        scanned: {type: Boolean, required: true, default: false},
        autoDetected: {type: Boolean, required: true, default: false},
        isWallet: {type: Boolean, required: true, default: false},
        expiredDate: {type: String, required: false,trim: true},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

CommuterRequestSchema.index({ position: "2dsphere" });
CommuterRequestSchema.indexes().push({associationID: 1}, {unique: false});
CommuterRequestSchema.indexes().push({fromLandmarkID: 1}, {unique: false});
CommuterRequestSchema.indexes().push({toLandmarkID: 1}, {unique: false});
CommuterRequestSchema.indexes().push({routeID: 1}, {unique: false});
CommuterRequestSchema.indexes().push({created: 1}, {unique: false});

const CommuterRequest = mongoose.model('CommuterRequest', CommuterRequestSchema);
export default CommuterRequest