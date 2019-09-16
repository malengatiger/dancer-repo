import mongoose from 'mongoose';

const CommuterIncentiveTypeSchema = new mongoose.Schema(
    {
        associationID: {type: String, required: true, trim: true},
        currency: {type: String, required: true,trim: true},
        endingDate: {type: String, required: true, trim: true},
        expiryPeriodInDays: {type: String, required: true, trim: true},
        numberOfRatings: {type: String, required: true, trim: true},
        prizeValue: {type: String, required: true, trim: true},
        stringDate: {type: String, required: true, trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const CommuterIncentiveType = mongoose.model('CommuterIncentiveType', CommuterIncentiveTypeSchema);
export default CommuterIncentiveType