import mongoose from 'mongoose';

const LandmarkSchema = new mongoose.Schema(
    {
        landmarkName: {type: String, required: true},
        position: {type: Map, required: true},
        routeDetails: {type: Array, required: true, default: []},
        cities: {type: Array, required: true, default: []},
        countryID: {type: String, required: true, default: '5cfd916347dc91e2290c11bc'},
        countryName: {type: String, required: true, default: 'South Africa'},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const Landmark = mongoose.model('Landmark', LandmarkSchema);
export default Landmark;