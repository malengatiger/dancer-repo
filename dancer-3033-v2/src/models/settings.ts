import mongoose from 'mongoose';

const SettingsModelSchema = new mongoose.Schema(
    {
        geofenceRadius: {type: Number, required: true},
        commuterGeofenceRadius: {type: Number, required: true},
        vehicleSearchMinutes: {type: Number, required: true},
        heartbeatIntervalSeconds: {type: Number, required: true},
        commuterSearchMinutes: {type: Number, required: false},
        commuterGeoQueryRadius: {type: Number, required: false},
        numberOfLandmarksToScan: {type: Number, required: false},
        distanceFilter: {type: Number, required: false},
        vehicleGeoQueryRadius: {type: Number, required: true},
        associationID: {type: String, required: true}, 
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

SettingsModelSchema.indexes().push({associationID: 1});
SettingsModelSchema.indexes().push({created: 1});

const SettingsModel = mongoose.model('SettingsModel', SettingsModelSchema);
export default SettingsModel