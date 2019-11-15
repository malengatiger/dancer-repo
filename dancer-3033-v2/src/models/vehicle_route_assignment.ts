import mongoose from 'mongoose';

const VehicleRouteAssignmentSchema = new mongoose.Schema(
    {
        associationID: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        vehicleReg: {type: String, required: true, trim: true},
        routeID: {type: String, required: true, trim: true},
        routeName: {type: String, required: false, trim: true},
        routeAssignmentID: {type: String, required: true, trim: true},

        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const VehicleRouteAssignment = mongoose.model('VehicleRouteAssignment', VehicleRouteAssignmentSchema);
export default VehicleRouteAssignment;