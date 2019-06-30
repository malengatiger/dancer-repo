import { DocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";
import { firestore } from "firebase-admin";
import v1 from "uuid/v1";
import Association from "../models/association";
import User from "../models/user";
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
export class UserHelper {
  public static async onUserAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onUserChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  user in stream:  🍀  🍀  🍎 `,
    );
  }

  public static async addUser(
    firstName: string,
    lastName: string,
    email: string,
    cellphone: string,
    userType: string,
    associationId: string,
  ): Promise<any> {
    const userModel = new User().getModelForClass(User);

    const mUser = new userModel({
      firstName,
      lastName,
      email,
      cellphone,
      userType,
      associationId,
    });
    if (associationId) {
      const assModel = new Association().getModelForClass(Association);
      const ass = await assModel.findByAssociationID(associationId);
      if (ass) {
        mUser.associationId = associationId;
        mUser.associationName = ass.associationName;
      } else {
        throw new Error("Invalid association");
      }
    }
    const m = await mUser.save();
    m.userID = m.id;
    await m.save();
    console.log(
      `\n\n💙 💚 💛  UserHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${mUser}  💙  💚  💛`,
    );
    return m;
  }

  public static async getUsersByAssociation(associationId: string): Promise<any> {
    console.log(` 🌀 getUsers find all users in association ....   c  🌀  🌀 `);
    const userModel = new User().getModelForClass(User);
    const list = await userModel.findByAssociationID(associationId);
    return list;
  }
  public static async getAllUsers(): Promise<any> {
    console.log(` 🌀 getUsers find all users in Mongo ....   c  🌀  🌀 `);
    const userModel = new User().getModelForClass(User);
    const list = await userModel.find();
    return list;
  }
  public static async getUserById(userId: string): Promise<any> {
    console.log(` 🌀 getUsers find user ....   c  🌀  🌀 `);
    const userModel = new User().getModelForClass(User);
    const user = await userModel.findByUserID(userId);
    return user;
  }
}
