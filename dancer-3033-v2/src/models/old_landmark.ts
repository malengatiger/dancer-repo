import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const OldLandmarkSchema = new mongoose.Schema(
    {
        landmarkName: {type: String, required: true, unique: true},
        position: {type: Map, required: true},
        routeDetails: {type: Array, required: true, default: []},
        cities: {type: Array, required: true, default: []},
        countryID: {type: String, required: false,},
        countryName: {type: String, required: false, },
        landmarkID: {type: String, required: true, },

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);
OldLandmarkSchema.plugin(uniqueValidator);
OldLandmarkSchema.indexes().push({position: '2dsphere'})
OldLandmarkSchema.indexes().push({landmarkName: 1}, {unique: true})

const OldLandmark = mongoose.model('OldLandmark', OldLandmarkSchema);
export default OldLandmark;