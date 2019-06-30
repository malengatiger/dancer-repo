import { CommuterRequestHelper } from './helpers/commuter_request_helper';
import { DispatchRecordHelper } from './helpers/dispatch_record_helper';
import { CommuterArrivalLandmarkHelper } from './helpers/commuter_arrival_helper';
import Constants from './helpers/constants';
import { AssociationHelper } from './helpers/association_helper';
import { LandmarkHelper } from "./helpers/landmark_helper";
import { RouteHelper } from "./helpers/route_helper";

class MongoListeners {
  public static listen(client: any) {

    console.log(
      `\n🔆🔆🔆  MongoListeners: 🧡🧡🧡  listening to changes in collections ... 👽 👽 👽\n`,
    );

    const associations = client.connection.collection(Constants.ASSOCIATIONS);
    const routes = client.connection.collection(Constants.ROUTES);
    const landmarks = client.connection.collection(Constants.LANDMARKS);
    const commuterArrivalLandmarks = client.connection.collection(Constants.COMMUTER_ARRIVAL_LANDMARKS);
    const commuterRequests = client.connection.collection(Constants.COMMUTER_REQUESTS);
    const dispatchRecords = client.connection.collection(Constants.DISPATCH_RECORDS);
    //
    const assocStream = associations.watch();
    const routeStream = routes.watch();
    const landmarkStream = landmarks.watch();
    const commuterArrivalStream = commuterArrivalLandmarks.watch();
    const commuterRequestsStream = commuterRequests.watch();
    const dispatchRecordsStream = dispatchRecords.watch();
    //
    assocStream.on("change", (event: any) => {
      console.log(
        `\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
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
