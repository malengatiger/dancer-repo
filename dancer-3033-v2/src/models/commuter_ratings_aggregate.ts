import mongoose from 'mongoose';

const CommuterRatingsAggregateSchema = new mongoose.Schema(
    {
        
        rating: {type: Map, required: true},
        ratingsCount: {type: Number, required: true},

        ownerID: {type: String, required: true, trim: true},
        ownerName: {type: String, required: true, trim: true},
        fromDate: {type: String, required: true},
        toDate: {type: String, required: true},
        vehicleReg: {type: String, required: true,},
        vehicleID: {type: String, required: true,},
        commuterRatingsAggregateID: {type: String, required: true,},
        associationD: {type: String, required: false,trim: true, index: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRatingsAggregate = mongoose.model('CommuterRatingsAggregate', CommuterRatingsAggregateSchema);
export default CommuterRatingsAggregate