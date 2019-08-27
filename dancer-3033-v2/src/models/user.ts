import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
export interface IUser extends Document {
    userID: string;
    email: string;
    firstName: string;
    lastName: string;
    cellphone: string;
    fcmToken: string;
    associationID: string;
    associationName: string;
    hash: string;
    salt: string;
    userType: string;
    created: string;
    firebaseUID: string;
  }
const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, unique: true, required: true, index: true},
        fcmToken: {type: String, required: false},
        cellphone: {type: String, required: true},
        userID: {type: String, required: true},
        associationID: {type: String, required: false},
        associationName: {type: String, required: false},
        userType: {type: String, required: true, enum: ['Staff', 'Administrator', 'Owner', 'Driver', 'Marshal', 'Patroller', 'Commuter'],},
        created: {type: String, required: true, default: new Date().toISOString()},
        firebaseUID: {type: String, required: true}
    }
);
UserSchema.plugin(uniqueValidator);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;