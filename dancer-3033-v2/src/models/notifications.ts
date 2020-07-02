import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        associationName: {type: String, required: true},
        landmarkID: {type: String, required: true},
        message: {type: String, required: true},
        created: {type: String, default: new Date().toISOString()},
        platform: {type: String, required: true},
        email: {type: String, required: true}
    }
);


const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification