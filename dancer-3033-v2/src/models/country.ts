import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true, unique: true, index: true},
        countryID: {type: String, required: false},
        countryCode: {type: String, required: true, default: 'ZA'},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const Country = mongoose.model('Country', CountrySchema);
export default Country