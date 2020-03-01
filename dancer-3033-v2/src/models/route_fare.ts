import mongoose from 'mongoose';

const RouteFareSchema = new mongoose.Schema(
    {
        routeName: {type: String, required: true},
        routeID: {type: String, required: true},
        associationID: {type: String, required: true, trim: true},
        associationName: {type: String, required: true, trim: true},
        fare: {type: Number, required: true},
        
        landmarkFares: {type: Array, required: true, default: []},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);

RouteFareSchema.index({associationID: 1})
RouteFareSchema.index({routeID: 1})
const RouteFare = mongoose.model('RouteFare', RouteFareSchema);
export default RouteFare;
