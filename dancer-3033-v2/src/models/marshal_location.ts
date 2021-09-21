import mongoose from 'mongoose';

//add points
const MarshalLocationSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        userID: {type: String, required: true, trim: true},
        address: {type: String, required: false, trim: true},
        routePoints: {type: Array, required: false, default: []},
        nearestLandmarks: {type: Array, required: false, default: []},
        batteryInfo: { type: Map, required: false, default: {}  },
        position: {type: Map, required: true},
        associationID: {type: String, required: true,trim: true, index: true},
        associationName: {type: String, required: true,trim: true},
        created: {type: String, required: true, default: new Date().toISOString(), index: true},
        metadata: {type: {}, required:false, default:{}}

    }
);

MarshalLocationSchema.index({ position: "2dsphere" });
MarshalLocationSchema.index({ associationID: 1 });
const MarshalLocation = mongoose.model('MarshalLocation', MarshalLocationSchema);
export default MarshalLocation