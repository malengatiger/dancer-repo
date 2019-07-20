import mongoose from 'mongoose';

const DispatchRecordSchema = new mongoose.Schema(
    {
        dispatched: {type: Boolean, required: true, default: false},
        landmarkID: {type: String, required: true},
        marshalID: {type: String, required: true},
        marshalName: {type: String, required: true},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        position: {type: Map, required: true},
        landmarkName: {type: String, required: true, trim: true},
        routeName: {type: String, required: true},
        routeID: {type: String, required: true},
        countryName: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        vehicleID: {type: String, required: true},
        vehicleType: {type: {}, required: true},
        ownerID: {type: String, required: false},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const DispatchRecord = mongoose.model('DispatchRecord', DispatchRecordSchema);
export default DispatchRecord