import mongoose from 'mongoose';

const CommuterIncentiveTypeSchema = new mongoose.Schema(
    {
        incentiveTypeID: {type: String, required: true, trim: true},
        userID: {type: String, required: true,trim: true},
        user: {type: Map, required: true, trim: true},
        incentive: {type: Map, required: true, trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const CommuterIncentiveType = mongoose.model('CommuterIncentiveType', CommuterIncentiveTypeSchema);
export default CommuterIncentiveType