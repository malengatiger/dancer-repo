import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const CommuterVehicleNearbySchema = new mongoose.Schema(
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
CommuterVehicleNearbySchema.plugin(uniqueValidator);
CommuterVehicleNearbySchema.indexes().push({position: '2dsphere'});
CommuterVehicleNearbySchema.indexes().push({vehicleID: 1}, {unique: false});
CommuterVehicleNearbySchema.indexes().push({milliseconds: 1}, {unique: false});

const CommuterVehicleNearby = mongoose.model('CommuterVehicleNearby', CommuterVehicleNearbySchema);
export default CommuterVehicleNearby;