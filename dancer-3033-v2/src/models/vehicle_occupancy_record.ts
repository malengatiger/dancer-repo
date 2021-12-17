import mongoose from 'mongoose';

/*
int currentPersons, personsIn, personsOut;
  String landmarkName, landmarkID, date, routeName, routeID;
  String vehicleID, vehicleReg, conductorID;
  Position position;
*/
const VehicleOccupancyRecordSchema = new mongoose.Schema(
    {
        vehicleReg: {type: String, required: true, trim: true},
        vehicleID: {type: String, required: true, trim: true},
        ownerID: {type: String, required: false, trim: true},
        position: {type: Map, required: true},
        currentPersons: {type: Number, required: true, default: 0},
        personsOut: {type: Number, required: true, default: 0},
        personsIn: {type: Number, required: true, default: 0},
        conductorID: {type: String, required: false,trim: true, index: true},
        routeName: {type: String, required: true,trim: true},
        routeID: {type: String, required: true,trim: true},
        date: {type: String, required: true, default: new Date().toISOString(), index: true},
        landmarkID: {type: String, required: false,trim: true},
        landmarkName: {type: String, required: false,trim: true},
       

    }
);

VehicleOccupancyRecordSchema.indexes().push({ position: "2dsphere" });
VehicleOccupancyRecordSchema.indexes().push({vehicleID: 1});
VehicleOccupancyRecordSchema.indexes().push({routeID: 1});
VehicleOccupancyRecordSchema.indexes().push({landmarkID: 1});
VehicleOccupancyRecordSchema.indexes().push({ownerID: 1});

const VehicleOccupancyRecord = mongoose.model('VehicleOccupancyRecord', VehicleOccupancyRecordSchema);
export default VehicleOccupancyRecord