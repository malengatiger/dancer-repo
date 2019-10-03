import mongoose from 'mongoose';
mongoose.set('debug', true);

const CommuterPrizeSchema = new mongoose.Schema(
    {
        network: {type: String, required: true},
        cellPhone: {type: String, required: true},
        userID: {type: String, required: false},

        created: {type: String, required: true, default: new Date().toISOString()},
    }
);

const CommuterPrize = mongoose.model('CommuterPrize', CommuterPrizeSchema);
export default CommuterPrize;