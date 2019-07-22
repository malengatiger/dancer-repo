import mongoose from 'mongoose';

const DispatchRecordSchema = new mongoose.Schema(
    {
        dispatched: {type: Boolean, required: true, default: false},
        landmarkID: {type: String, required: true},
        marshalID: {type: String, required: true},
        marshalName: {type: String, required: true},
        position: {type: Map, required: true},
        landmarkName: {type: String, required: true, trim: true},
        routeName: {type: String, required: true},
        routeID: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        vehicleID: {type: String, required: true},
        vehicleType: {type: {}, required: true},
        ownerID: {type: String, required: false},
        passengers: {type: Number, required: true},
        dispatchRecordID: {type: String, required: true},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const DispatchRecord = mongoose.model('DispatchRecord', DispatchRecordSchema);
export default DispatchRecord