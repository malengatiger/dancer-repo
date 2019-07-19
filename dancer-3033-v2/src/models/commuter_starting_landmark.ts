import mongoose from 'mongoose';
import {Position} from '../models/interfaces'

const CommuterStartingLandmarkSchema = new mongoose.Schema(
    {
        landmarkId: {type: String, required: true},
        landmarkName: {type: String, required: true},
        toLandmarkId: {type: String, required: true},
        toLandmarkName: {type: String, required: true},
        
        position: {type: Position, required: true},
        userId: {type: String, required: true, trim: true},
        
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);


const CommuterStartingLandmark = mongoose.model('CommuterStartingLandmark', CommuterStartingLandmarkSchema);
export default CommuterStartingLandmark