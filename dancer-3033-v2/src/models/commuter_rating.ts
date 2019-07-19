import mongoose from 'mongoose';
import {Position, Rating} from '../models/interfaces'

const CommuterRatingSchema = new mongoose.Schema(
    {
        commuterRequestId: {type: String, required: true, trim: true},
        rating: {type: Rating, required: true},
        userId: {type: String, required: true},
        position: {type: Position, required: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterRating = mongoose.model('CommuterRating', CommuterRatingSchema);
export default CommuterRating