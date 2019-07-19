import mongoose from 'mongoose';

const CommuterRatingsAggregateSchema = new mongoose.Schema(
    {
        driver: {type: Number, required: true},
        rank: {type: Number, required: true},
        overall: {type: Number, required: true},
        vehicle: {type: Number, required: true},
        ratingsCount: {type: Number, required: true},

        ownerId: {type: String, required: true, trim: true},
        ownerName: {type: String, required: true, trim: true},
        fromDate: {type: String, required: true},
        toDate: {type: String, required: true},
        vehicleReg: {type: String, required: true,},
        vehicleId: {type: String, required: true,},
        
        createdAt: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRatingsAggregate = mongoose.model('CommuterRatingsAggregate', CommuterRatingsAggregateSchema);
export default CommuterRatingsAggregate