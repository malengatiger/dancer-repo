import User from "../models/user";
import {appTo} from "../helpers/messaging"

class UserHelper {

    static async addUser(user: any): Promise<void> {
        //create user on firebase auth ....
        await appTo.auth().createUser({
            uid: user.userID,
            email: user.email, 
            password: user.password? user.password : user.password:'changeThisPassword'
            displayName: user.firstName + ' ' + user.lastName,
          })
            .then(function(userRecord) {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log('😍😍😍😍 Successfully created new Firebase auth user:', userRecord.displayName);
            })
            .catch(function(error) {
              console.error('😈😈😈Error creating new Firebase auth user:', error);
            });
    }

    static async deleteUser(userID: string): Promise<void> {
        await appTo.auth().deleteUser(userID);
        console.log('😍😍😍😍🍎 Successfully deleted Firebase auth user: 🍎', userID);
    }
}
export default UserHelper