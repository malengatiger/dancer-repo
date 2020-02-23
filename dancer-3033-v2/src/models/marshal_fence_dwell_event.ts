import mongoose from 'mongoose';

const MarshalFenceDwellEventSchema = new mongoose.Schema(
    {
        landmarkID: {type: String, required: true, trim: true},
        landmarkName: {type: String, required: true, trim: true},
        position: {type: Map, required: true,},
        userID: {type: String, required: false,},
        marshalFenceEventID: {type: String, required: true, },

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

MarshalFenceDwellEventSchema.index({ position: "2dsphere" });
const MarshalFenceDwellEvent = mongoose.model('MarshalFenceDwellEvent', MarshalFenceDwellEventSchema);
export default MarshalFenceDwellEvent;