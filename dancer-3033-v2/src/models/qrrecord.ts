import mongoose, { Schema, Document } from "mongoose";

export interface IQRRecord extends Document {
  seatNumber: number;
  url: string;
  vehicleReg: string;
  vehicleID: string;
  vehicleType: {};
  qrRecordID: string;
  associationID: string;
  associationName: string;
  userType: string;
  created: string;
}

const QRRecordSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  url: { type: String, required: true },
  vehicleReg: { type: String, required: true },
  vehicleID: { type: String, required: true },
  vehicleType: { type: {}, required: true },
  qrRecordID: { type: String, required: true },
  associationID: { type: String, required: true, trim: true, index: true },
  associationName: { type: String, required: true, trim: true },
  created: { type: String, required: true, default: new Date().toISOString() },
});

QRRecordSchema.index({ associationD: 1 });
QRRecordSchema.index({ vehicleID: 1 });
const QRRecord = mongoose.model<IQRRecord>("QRRecord", QRRecordSchema);
export default QRRecord;
