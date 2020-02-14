import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        routeID: {type: String, required: true},
        associationID: {type: String, required: true, trim: true},
        associationName: {type: String, required: true, trim: true},
        color: {type: String, required: true, default: 'white'},
        
        rawRoutePoints: {type: Array, required: true, default: []},
        routePoints: {type: Array, required: true, default: []},
        calculatedDistances: {type: Array, required: true, default: []},

        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const Route = mongoose.model('Route', RouteSchema);
export default Route;
