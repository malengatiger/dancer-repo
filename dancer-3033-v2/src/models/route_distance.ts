import mongoose from 'mongoose';
/*
 String routeID, routeName, nearestLandmark;
  List<DynamicDistance> dynamicDistances;
  double distanceToNearestLandmark;
  String created;
*/
const RouteDistanceEstimationSchema = new mongoose.Schema(
    {
        routeID: {type: String, required: true},
        routeName: {type: String, required: true},
        nearestLandmark: {type: String, required: true, trim: true},
        distanceToNearestLandmark: {type: Number, required: true},
        vehicle: {type: Object, required: true},
        dynamicDistances: {type: Array, required: true, default: []},

        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const RouteDistanceEstimation = mongoose.model('RouteDistanceEstimation', RouteDistanceEstimationSchema);
export default RouteDistanceEstimation;
