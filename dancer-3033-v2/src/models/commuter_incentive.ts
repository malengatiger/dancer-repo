import mongoose from 'mongoose';

const CommuterIncentiveSchema = new mongoose.Schema(
    {
        incentiveTypeID: {type: String, required: true, trim: true},
        userID: {type: String, required: true,trim: true},
        user: {type: Map, required: true, trim: true},
        incentive: {type: Map, required: true, trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const CommuterIncentive = mongoose.model('CommuterIncentive', CommuterIncentiveSchema);
export default CommuterIncentive