import mongoose from 'mongoose';

const CommuterPanicSchema = new mongoose.Schema(
    {
        active: {type: Boolean, required: true, default: true},
        type: {type: String, required: true, enum: ['FollowMe', 'Accident', 'Breakdown', 'Traffic', 'Robbery', 'Rape', 'Construction'], trim: true},
        position: {type: Map, required: true},
        commuterPanicID: {type: String, required: false},
        vehicleID: {type: String, required: false,trim: true},
        vehicleReg: {type: String, required: false, trim: true},
        userID: {type: String, required: true, trim: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterPanic = mongoose.model('CommuterPanic', CommuterPanicSchema);
export default CommuterPanic