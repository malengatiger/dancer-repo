/*
class VehicleCommand {
  String? vehicleID, vehicleCommandID;
  String? vehicleReg;
  String? created, command;
  String? userID;
  String? responseTopic;
  String? intervalInSeconds;
*/
import mongoose from 'mongoose';

const VehicleCommandSchema = new mongoose.Schema(
    {
        vehicleCommandID: {type: String, required: true},
        vehicleID: {type: String, required: true},
        vehicleReg: {type: String, required: true},
        intervalInSeconds: {type: Number, required: true, default: 0},
        responseTopic: {type: String, required: true},
        userID: {type: String, required: false},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

VehicleCommandSchema.indexes().push({vehicleID: 1}, {unique: false});
VehicleCommandSchema.indexes().push({created: 1}, {unique: false});

const VehicleCommand = mongoose.model('VehicleCommand', VehicleCommandSchema);
export default VehicleCommand