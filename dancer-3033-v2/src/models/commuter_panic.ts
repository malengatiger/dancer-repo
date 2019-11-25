import mongoose from 'mongoose';

const CommuterPanicSchema = new mongoose.Schema(
    {
        active: {type: Boolean, required: true, default: true},
        type: {type: String, required: true, enum: ['FollowMe', 'Accident', 'Breakdown', 'Traffic', 'Robbery', 'Rape', 'Construction', 'Passenger Emergency'], trim: true},
        vehicleID: {type: String, required: false,trim: true},
        vehicleReg: {type: String, required: false, trim: true},
        position: {type: Object, required: true},
        userID: {type: String, required: false, trim: true},
        commuterPanicID: {type: String, required: true, trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},
        updated: {type: String, required: true, default: new Date().toISOString()},
    }
);

CommuterPanicSchema.index({ position: "2dsphere" });
const CommuterPanic = mongoose.model('CommuterPanic', CommuterPanicSchema);
export default CommuterPanic