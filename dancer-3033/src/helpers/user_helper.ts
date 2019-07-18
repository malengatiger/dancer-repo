
import Association from "../models/association";
import User from "../models/user";
import Messaging from "../server/messaging";
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
export class UserHelper {
  public static async onUserAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onUserChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  user in stream:  🍀  🍀  🍎 `,
    );
    if (event.operationType === 'insert') {
      const user = new User();
      const data = event.fullDocument;
      if (data) { 
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.cellphone = data.cellphone;
        user.associationID = data.associationID;
        
        await Messaging.sendUser(user);
    }
    }
  }

  public static async addUser(
    firstName: string,
    lastName: string,
    email: string,
    cellphone: string,
    userType: string,
    associationID: string,
    countryID: string,
    gender: string,
    fcmToken: string,
  ): Promise<any> {
    const userModel = new User().getModelForClass(User);

    const mUser = new userModel({
      firstName,
      lastName,
      email,
      cellphone,
      userType,
      associationID,
      countryID, gender, fcmToken,
    });
    if (associationID) {
      const assModel = new Association().getModelForClass(Association);
      const ass: any = await assModel.findByAssociationId(associationID);
      if (ass) {
        mUser.associationID = associationID;
        mUser.associationName = ass.associationName;
      } else {
        throw new Error(`Invalid association: ${associationID}`);
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
  public static async getUserByEmail(email: string): Promise<any> {
    console.log(` 🌀 getUserByEmail find user ....   c  🌀  🌀 `);
    const userModel = new User().getModelForClass(User);
    const user = await userModel.find({email: email});
    return user;
  }
}
