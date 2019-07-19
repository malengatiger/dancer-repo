import mongoose from 'mongoose';
interface UserPoint {
    type: String,
    coordinates: any
}

const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        fcmToken: {type: String, required: false},
        cellphone: {type: String, required: true},
        associationID: {type: String, required: false},
        associationName: {type: String, required: false},
        userType: {type: String, required: true, default: 'white'},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const User = mongoose.model('User', UserSchema);
export default User;