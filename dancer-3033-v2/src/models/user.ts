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
        cellphone: {type: String, required: false},
        userID: {type: String, required: true, index: true, unique: true},
        associationID: {type: String, required: false,  index: true},
        associationName: {type: String, required: false},
        userType: {type: String, required: true, enum: ['Staff', 'Administrator', 'Owner', 'Driver', 'Marshal', 'Patroller', 'Commuter'],},
        gender: {type: String, required: false, enum: ['Male', 'Female'],},
        created: {type: String, required: true, default: new Date().toISOString()}
    }
);
UserSchema.plugin(uniqueValidator);
UserSchema.indexes().push({email: 1}, {unique: true});
UserSchema.indexes().push({cellphone: 1}, {unique: true});
const User = mongoose.model<IUser>('User', UserSchema);
export default User;