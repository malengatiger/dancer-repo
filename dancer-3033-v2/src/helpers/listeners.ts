
import Constants from '../helpers/constants';
import Messaging from './messaging';
import log from '../log';


class MongoListeners {
  public static listen(client: any) {

    log(
      `\n🔆🔆🔆  MongoListeners: 🧡🧡🧡  listening to changes in collections ... 👽👽👽\n`,
    );

    const users = client.connection.collection(Constants.USERS);
    const associations = client.connection.collection(Constants.ASSOCIATIONS);
    const routes = client.connection.collection(Constants.ROUTES);
    const landmarks = client.connection.collection(Constants.LANDMARKS);
    const commuterArrivalLandmarks = client.connection.collection(Constants.COMMUTER_ARRIVAL_LANDMARKS);
    const commuterRequests = client.connection.collection(Constants.COMMUTER_REQUESTS);
    const dispatchRecords = client.connection.collection(Constants.DISPATCH_RECORDS);
    const panics = client.connection.collection(Constants.COMMUTER_PANICS);
    const vehicleArrivals = client.connection.collection(Constants.VEHICLE_ARRIVALS);
    const vehicleDepartures = client.connection.collection(Constants.VEHICLE_DEPARTURES);
    const commuterPickups = client.connection.collection(Constants.COMMUTER_PICKUP_LANDMARKS);

    //
    const assocStream = associations.watch();
    const routeStream = routes.watch();
    const landmarkStream = landmarks.watch();

    const commuterArrivalStream = commuterArrivalLandmarks.watch({ fullDocument: 'updateLookup' });
    const commuterRequestsStream = commuterRequests.watch({ fullDocument: 'updateLookup' });
    const dispatchRecordsStream = dispatchRecords.watch({ fullDocument: 'updateLookup' });

    const usersStream = users.watch({ fullDocument: 'updateLookup' });
    const panicStream = panics.watch({ fullDocument: 'updateLookup' });

    const vehicleArrivalsStream = vehicleArrivals.watch({ fullDocument: 'updateLookup' });
    const vehicleDeparturesStream = vehicleDepartures.watch({ fullDocument: 'updateLookup' });
    const commuterPickupsStream = commuterPickups.watch({ fullDocument: 'updateLookup' });
    //
    vehicleArrivalsStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  vehicleArrivalsStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      Messaging.sendVehicleArrival(event.fullDocument);
    });
    //
    vehicleDeparturesStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  vehicleDeparturesStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      Messaging.sendVehicleDeparture(event.fullDocument);
    });
    //
    commuterPickupsStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  commuterPickupsStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      Messaging.sendCommuterPickupLandmark(event.fullDocument);
    });
    //
    panicStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      Messaging.sendCommuterPanic(event.fullDocument);
    });
    //
    usersStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      Messaging.sendUser(event.fullDocument);
    });
    //
    assocStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`,
      );
      log(event);
      // AssociationHelper.onAssociationAdded(event);
    });
    //
    routeStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      Messaging.sendRoute(event.fullDocument);
    });
    //
    landmarkStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      Messaging.sendLandmark(event.fullDocument);
    });
    //
    commuterArrivalStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      Messaging.sendCommuterArrivalLandmark(event.fullDocument);
    });
    //
    commuterRequestsStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      Messaging.sendCommuterRequest(event.fullDocument);
    });
    //
    dispatchRecordsStream.on("change", (event: any) => {
      log(
        `\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `,
      );
      Messaging.sendDispatchRecord(event.fullDocument);
    });
  }
 
}


export default MongoListeners;
