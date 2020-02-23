import mongoose from 'mongoose';

const MarshalFenceExitEventSchema = new mongoose.Schema(
    {
        landmarkID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true, trim: true},
        position: {type: Map, required: true},
        userID: {type: String, required: false,},
        marshalFenceEventID: {type: String, required: true, },

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

MarshalFenceExitEventSchema.index({ position: "2dsphere" });
const MarshalFenceExitEvent = mongoose.model('MarshalFenceExitEvent', MarshalFenceExitEventSchema);
export default MarshalFenceExitEvent;