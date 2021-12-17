/*
class VehicleCommandResponse {
  String? vehicleCommandResponseID;
  String? created;
  bool? commandSucceeded;
  VehicleCommand? vehicleCommand;
  VehicleLocation? vehicleLocation;
  RouteDistanceEstimation? routeDistanceEstimation;
  String? type;
*/
import mongoose from "mongoose";

const VehicleCommandResponseSchema = new mongoose.Schema({
  vehicleCommandResponseID: { type: String, required: true },
  commandSucceeded: { type: String, required: true, default: false },
  vehicleCommand: { type: Map, required: true, default: {}  },
  vehicleLocation: { type: Map, required: false, default: {}  },
  batteryInfo: { type: Map, required: false, default: {}  },
  settingsModel: { type: Map, required: false, default: {}  },
  responseTopic: {type: String, required: true},
  routeID: {type: String, required: false},
  routeName: {type: String, required: false},

  routeDistanceEstimation: { type: Map, required: false, default: {} },
  created: { type: String, required: true, default: new Date().toISOString() },
});

VehicleCommandResponseSchema.indexes().push(
  { vehicleID: 1 }
);
VehicleCommandResponseSchema.indexes().push({ created: 1 });
VehicleCommandResponseSchema.indexes().push({ 'vehicleCommand.vehicleID': 1 });

const VehicleCommandResponse = mongoose.model(
  "VehicleCommandResponse",
  VehicleCommandResponseSchema
);
export default VehicleCommandResponse;
