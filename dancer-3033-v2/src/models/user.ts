import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userID: string;
    email: string;
    firstName: string;
    lastName: string;
    fcmToken: string;
    associationID: string;
    associationName: string;
    userType: string;
    created: string;
  }
const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        fcmToken: {type: String, required: false},
        cellphone: {type: String, required: true},
        userID: {type: String, required: false},
        associationID: {type: String, required: false},
        associationName: {type: String, required: false},
        userType: {type: String, required: true,},
        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const User = mongoose.model<IUser>('User', UserSchema);
export default User;