import mongoose from 'mongoose';

const CommuterFenceDwellEventSchema = new mongoose.Schema(
    {
        landmarkID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true, trim: true},
        position: {type: Map, required: true},
        userID: {type: String, required: false,},
        commuterFenceEventID: {type: String, required: true, },

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterFenceDwellEvent = mongoose.model('CommuterFenceDwellEvent', CommuterFenceDwellEventSchema);
export default CommuterFenceDwellEvent;