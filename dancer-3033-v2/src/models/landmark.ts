import mongoose from "mongoose";
const LandmarkSchema = new mongoose.Schema({
  landmarkName: { type: String, required: true, unique: true },
  position: { type: Map, required: true },
  routeDetails: { type: Array, required: true, default: [] },
  routePoints: { type: Array, required: true, default: [] },
  cities: { type: Array, required: true, default: [] },
  countryID: { type: String, required: false },
  countryName: { type: String, required: false },
  landmarkID: { type: String, required: true },

  created: { type: String, required: true, default: new Date().toISOString() },
  updated: { type: String, required: false },
});
// LandmarkSchema.plugin(uniqueValidator);
// LandmarkSchema.indexes().push({ position: "2dsphere" });
// LandmarkSchema.indexes().push(
//   { landmarkID: 1, "routeDetails.routeID": 1 },
//   { unique: true }
// );
// LandmarkSchema.indexes().push({ landmarkID: 1 }, { unique: true });
// LandmarkSchema.indexes().push({ "routeDetails.routeID": 1 });
//routeDetails.routeID

const Landmark = mongoose.model("Landmark", LandmarkSchema);
export default Landmark;
