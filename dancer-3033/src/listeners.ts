import { CommuterPanicHelper } from './helpers/commuter_panic_helper';
import { CommuterRequestHelper } from './helpers/commuter_request_helper';
import { DispatchRecordHelper } from './helpers/dispatch_record_helper';
import { CommuterArrivalLandmarkHelper } from './helpers/commuter_arrival_helper';
import Constants from './helpers/constants';
import { AssociationHelper } from './helpers/association_helper';
import { LandmarkHelper } from "./helpers/landmark_helper";
import { RouteHelper } from "./helpers/route_helper";
import { MongoClient, ChangeStream, MongoCallback } from 'mongodb';
import { UserHelper } from './helpers/user_helper';

class MongoListeners {
  public static listen(client:any) {

    console.log(
      `\n🔆🔆🔆  MongoListeners: 🧡🧡🧡  listening to changes in collections ... 👽 👽 👽\n`,
    );

    const users = client.connection.collection(Constants.USERS);
    const associations = client.connection.collection(Constants.ASSOCIATIONS);
    const routes = client.connection.collection(Constants.ROUTES);
    const landmarks = client.connection.collection(Constants.LANDMARKS);
    const commuterArrivalLandmarks = client.connection.collection(Constants.COMMUTER_ARRIVAL_LANDMARKS);
    const commuterRequests = client.connection.collection(Constants.COMMUTER_REQUESTS);
    const dispatchRecords = client.connection.collection(Constants.DISPATCH_RECORDS);
    const panics = client.connection.collection(Constants.COMMUTER_PANICS);

    //
    const assocStream = associations.watch();
    const routeStream = routes.watch();
    const landmarkStream = landmarks.watch();
    const commuterArrivalStream = commuterArrivalLandmarks.watch();
    const commuterRequestsStream = commuterRequests.watch();
    const dispatchRecordsStream = dispatchRecords.watch();
  
    const usersStream = users.watch({ fullDocument: 'updateLookup' });
    const panicStream = panics.watch({ fullDocument: 'updateLookup' });

    panicStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      console.log(event);
      CommuterPanicHelper.onCommuterPanicChanged(event);
    });
    //
    usersStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      console.log(event);
      UserHelper.onUserAdded(event);
    });
    //
    assocStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      console.log(event);
      AssociationHelper.onAssociationAdded(event);
    });
    //
    routeStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      RouteHelper.onRouteAdded(event);
    });
    //
    landmarkStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      LandmarkHelper.onLandmarkAdded(event);
    });
    //
    commuterArrivalStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      CommuterArrivalLandmarkHelper.onCommuterArrivalLandmarkAdded(event);
    });
    //
    commuterRequestsStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      CommuterRequestHelper.onCommuterRequestAdded(event);
    });
    //
    dispatchRecordsStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      DispatchRecordHelper.onDispatchRecordAdded(event);
    });
  }
}

export default MongoListeners;
