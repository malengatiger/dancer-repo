import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        associationName: {type: String, required: true},
        landmarks: {type: Array, required: true},
        message: {type: String, required: true},
        messageDate: {type: String, default: new Date().toISOString()},
        platforms: {type: Array, required: true},
        userEmail: {type: String, required: true},
    }
);


const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification