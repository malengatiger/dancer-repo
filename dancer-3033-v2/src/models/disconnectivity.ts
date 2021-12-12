import mongoose from "mongoose";

const DisconnectivitySchema = new mongoose.Schema({
  vehicleReg: { type: String, required: true, trim: true, unique: true },
  vehicleID: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  associationID: { type: String, required: true, trim: true },
  disconnectivityID: { type: String, required: true, trim: true },
  associationName: { type: String, required: true },
  ownerID: { type: String, required: false, trim: true },
  created: { type: String, required: true, default: new Date().toISOString() },
});
// DisconnectivitySchema.plugin(uniqueValidator);
DisconnectivitySchema.index({ vehicleID: 1 }, { unique: false });

const Disconnectivity = mongoose.model(
  "Disconnectivity",
  DisconnectivitySchema
);
export default Disconnectivity;
