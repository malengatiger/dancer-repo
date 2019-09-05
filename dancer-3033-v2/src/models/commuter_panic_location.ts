import mongoose from 'mongoose';

const CommuterPanicLocationSchema = new mongoose.Schema(
    {        
        commuterPanicID: {type: String, required: true},
        position: {type: Map, required: true}, 
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const CommuterPanicLocation = mongoose.model('CommuterPanicLocation', CommuterPanicLocationSchema);
export default CommuterPanicLocation