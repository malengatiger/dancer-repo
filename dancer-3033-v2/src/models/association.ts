import mongoose from 'mongoose';
import validator from 'validator';
// Base definition
const AssociationSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true,},
        cellphone: {type: String, required: true,},
        countryID: {type: String, required: true},
        countryName: {type: String, required: true},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const Association = mongoose.model('Association', AssociationSchema);
export default Association;