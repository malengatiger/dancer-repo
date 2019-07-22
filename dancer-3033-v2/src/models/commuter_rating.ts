import mongoose from 'mongoose';

const CommuterRatingSchema = new mongoose.Schema(
    {
        commuterRequestID: {type: String, required: true, trim: true},
        rating: {type: Map, required: true},
        userID: {type: String, required: true},
        commuterRatingID: {type: String, required: true},
        position: {type: Map, required: true},
        associationD: {type: String, required: false,trim: true},
        associationName: {type: String, required: false,trim: true},
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRating = mongoose.model('CommuterRating', CommuterRatingSchema);
export default CommuterRating