import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const RouteSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        routeID: {type: String, required: true},
        associationID: {type: String, required: false, trim: true},
        associationName: {type: String, required: false, trim: true},
        color: {type: String, required: false, default: 'white'},
        heading: {type: Number, required: true, default: 0.0},
        lengthInMetres: {type: Number, required: true, default: 0.0},
        rawRoutePoints: {type: Array, required: true, default: []},
        routePoints: {type: Array, required: true, default: []},
        calculatedDistances: {type: Array, required: true, default: []},
        created: {type: String, required: true, default: new Date().toISOString()},
        updated: {type: String, required: false},
    }
);

RouteSchema.plugin(uniqueValidator);
RouteSchema.indexes().push({associationID: 1, routeID: 1}, {unique: true});
RouteSchema.indexes().push({associationID: 1, name: 1}, {unique: true});

const Route = mongoose.model('Route', RouteSchema);
export default Route;
