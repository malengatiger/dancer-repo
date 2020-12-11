import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const AppTerminationSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: false, trim: true},
        vehicleID: {type: String, required: false, trim: true, index: true},
        associationID: {type: String, required: false, trim: true},
        associationName: {type: String, required: false, trim: true},
        userID: {type: String, required: false, trim: true},
        androidVersion: {type: String, required: false, trim: true},
        manufacturer: {type: String, required: false, trim: true},
        userType: {type: String, required: false, default: []},
        model: {type: String, required: false, default: []},
        position: {type: Map, required: false, default: {}},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

AppTerminationSchema.index({created: 1})
AppTerminationSchema.index({ position: "2dsphere" });
const AppTermination = mongoose.model('AppTermination', AppTerminationSchema);
export default AppTermination