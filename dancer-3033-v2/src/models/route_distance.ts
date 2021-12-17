import mongoose from 'mongoose';

const RouteDistanceEstimationSchema = new mongoose.Schema(
    {
        routeID: {type: String, required: true},
        routeName: {type: String, required: true},
        nearestLandmarkID: {type: String, required: true, trim: true},
        nearestLandmarkName: {type: String, required: true, trim: true},
        distanceToNearestLandmark: {type: Number, required: true},
        vehicle: {type: Object, required: true},
        dynamicDistances: {type: Array, required: true, default: []},

        created: {type: String, required: true, default: new Date().toISOString()},
    }
);

RouteDistanceEstimationSchema.indexes().push({'vehicle.vehicleID': 1});
RouteDistanceEstimationSchema.indexes().push({routeID: 1});
RouteDistanceEstimationSchema.indexes().push({'dynamicDistances.landmarkID': 1});

const RouteDistanceEstimation = mongoose.model('RouteDistanceEstimation', RouteDistanceEstimationSchema);
export default RouteDistanceEstimation;
