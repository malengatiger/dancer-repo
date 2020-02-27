import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const VehicleCommuterNearbySchema = new mongoose.Schema(
    {
        vehicleID: {type: String, required: true, trim: true, index: true},
        vehicleReg: {type: String, required: true, trim: true},
        userID: {type: String, required: true},
        date: {type: String, required: true, default: new Date().toISOString()},
        cellphone: {type: String, required: false},
        milliseconds: {type: Number, required: true, index: true, default: new Date().getTime()},
        position: {type: Map, required: true},
        created: {type: String, required: true, default: new Date().toISOString()}
    }
);
VehicleCommuterNearbySchema.plugin(uniqueValidator);
VehicleCommuterNearbySchema.indexes().push({position: '2dsphere'});
VehicleCommuterNearbySchema.indexes().push({vehicleID: 1}, {unique: false});
VehicleCommuterNearbySchema.indexes().push({milliseconds: 1}, {unique: false});

const VehicleCommuterNearby = mongoose.model('VehicleCommuterNearby', VehicleCommuterNearbySchema);
export default VehicleCommuterNearby;