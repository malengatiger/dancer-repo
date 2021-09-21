import mongoose from "mongoose";

//add points
/*
String? associationID, associationName, peakItemID;
  int? startHour, endHour, heartbeatFrequencyInMinutes;
*/
const PeakItemSchema = new mongoose.Schema({
  associationID: { type: String, required: true, trim: true },
  associationName: { type: String, required: true, trim: true },
  peakItemID: { type: String, required: true, trim: true },
  startHour: { type: Number, required: true },
  endHour: { type: Number, required: true },
  heartbeatFrequencyInMinutes: { type: Number, required: true, default: 300 },
  created: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
});

PeakItemSchema.index({ associationID: 1 });
const PeakItem = mongoose.model("PeakItem", PeakItemSchema);
export default PeakItem;
