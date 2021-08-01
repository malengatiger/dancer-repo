import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true, index: true},
        provinceName: {type: String, required: true, index: true},
        countryID: {type: String, required: true},
        countryName: {type: String, required: true},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        position: {type: Map, required: true},        
        created: {type: String, required: true, default: new Date().toISOString()},
        updated: {type: String, required: false},

    }
);

CitySchema.index({position: '2dsphere'})
const City = mongoose.model('City', CitySchema);
export default City