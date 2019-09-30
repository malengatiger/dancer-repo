import mongoose from 'mongoose';

const CommuterIncentiveSchema = new mongoose.Schema(
    {
        incentiveTypeID: {type: String, required: true, trim: true},
        userID: {type: String, required: true,trim: true},
        user: {type: Object, required: true, trim: true},
        incentive: {type: Object, required: true, trim: true},
        name: {type: String, required: true, trim: true},
        network: {type: String, required: true, trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const CommuterIncentive = mongoose.model('CommuterIncentive', CommuterIncentiveSchema);
export default CommuterIncentive