import mongoose from "mongoose";

const VehicleRouteAssignmentSchema = new mongoose.Schema({
  associationID: { type: String, required: true, trim: true },
  vehicleID: { type: String, required: true, trim: true },
  vehicleReg: { type: String, required: true, trim: true },
  routeID: { type: String, required: true, trim: true },
  activeFlag: { type: Boolean, required: true, default: true },
  routeName: { type: String, required: true, trim: true },
  routeAssignmentID: { type: String, required: true, trim: true },

  created: { type: String, required: true, default: new Date().toISOString() },
});

// VehicleRouteAssignmentSchema.plugin(uniqueValidator);
// VehicleRouteAssignmentSchema.indexes().push(
//   { routeID: 1, vehicleID: 1 },
//   { unique: true }
// );
const VehicleRouteAssignment = mongoose.model(
  "VehicleRouteAssignment",
  VehicleRouteAssignmentSchema
);
export default VehicleRouteAssignment;
