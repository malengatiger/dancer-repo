import mongoose from "mongoose";

const AssociationSchema = new mongoose.Schema({
  associationName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  cellphone: { type: String, required: true, unique: true },
  countryID: { type: String, required: true },
  countryName: { type: String, required: true },
  associationID: { type: String, required: true, index: true },

  created: { type: String, required: true, default: new Date().toISOString() },
});
// AssociationSchema.index({countryID: 1, associationName: 1}, {unique: true});
// AssociationSchema.plugin(uniqueValidator);

const Association = mongoose.model("Association", AssociationSchema);
export default Association;
