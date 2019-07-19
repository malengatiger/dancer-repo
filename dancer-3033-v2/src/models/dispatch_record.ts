import mongoose from 'mongoose';

const DispatchRecordSchema = new mongoose.Schema(
    {
        dispatched: {type: Boolean, required: true, default: false},
        landmarkId: {type: String, required: true},
        marshalId: {type: String, required: true},
        marshalName: {type: String, required: true},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        position: {type: Map, required: true},
        landmarkName: {type: String, required: true, trim: true},
        routeName: {type: String, required: true},
        routeId: {type: String, required: true},
        countryName: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        vehicleId: {type: String, required: true},
        vehicleType: {type: {}, required: true},
        ownerId: {type: String, required: false},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const DispatchRecord = mongoose.model('DispatchRecord', DispatchRecordSchema);
export default DispatchRecord