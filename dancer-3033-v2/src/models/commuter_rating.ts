import mongoose from 'mongoose';

const CommuterRatingSchema = new mongoose.Schema(
    {
        commuterRequestId: {type: String, required: true, trim: true},
        rating: {type: Map, required: true},
        userId: {type: String, required: true},
        position: {type: Map, required: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRating = mongoose.model('CommuterRating', CommuterRatingSchema);
export default CommuterRating