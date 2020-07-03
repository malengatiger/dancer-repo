import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const chatSchema = new mongoose.Schema(
    {
        email: {type: String, unique: true, required: true, index: true},
        associationID: {type: String, required: true},
        associationName: {type: String, required: true},
        message: {type: String, required: true},
        messageType: {type: String, required: true, enum: ['Question', 'Answer'],},
        created: {type: String, required: true, default: new Date().toISOString()},
        opened: {type: Boolean, required: true}
    }
);
chatSchema.plugin(uniqueValidator);

const ChatObject = mongoose.model('chatSupport', chatSchema);
export default ChatObject;