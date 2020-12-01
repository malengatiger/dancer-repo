import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const LandmarkSchema = new mongoose.Schema(
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
LandmarkSchema.plugin(uniqueValidator);
LandmarkSchema.indexes().push({position: '2dsphere'})
LandmarkSchema.indexes().push({'routeDetails.routeID': 1}, {unique: false});
LandmarkSchema.indexes().push({landmarkID: 1}, {unique: true});

const Landmark = mongoose.model('Landmark', LandmarkSchema);
export default Landmark;