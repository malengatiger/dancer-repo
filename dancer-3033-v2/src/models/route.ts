import mongoose from 'mongoose';
interface RoutePoint {
    type: String,
    coordinates: any
}
const RouteSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        associationDetails: {type: Array, required: true, default: []},
        color: {type: String, required: true, default: 'white'},
        created: {type: String, required: true, default: new Date().toISOString()},

        rawRoutePoints: {type: Array, required: true, default: []},
        routePoints: {type: Array, required: true, default: []},
        calculatedDistances: {type: Array, required: true, default: []},
    }
);


const Route = mongoose.model('Route', RouteSchema);
export default Route;