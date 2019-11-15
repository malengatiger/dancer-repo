import mongoose from 'mongoose';

const CommuterFenceExitEventSchema = new mongoose.Schema(
    {
        landmarkID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true, trim: true},
        position: {type: Map, required: true},
        userID: {type: String, required: false,},
        commuterFenceEventID: {type: String, required: true, },

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterFenceExitEvent = mongoose.model('CommuterFenceExitEvent', CommuterFenceExitEventSchema);
export default CommuterFenceExitEvent;