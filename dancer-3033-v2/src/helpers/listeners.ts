
import Constants from '../helpers/constants';
import Messaging from './messaging';
import { log } from '../log';


class MongoListeners {
  public static listen(client: any) {

    log(
      `\n🔆🔆🔆  MongoListeners: listening to changes in collections ... 👽👽👽\n`,
    );

    const users = client.connection.collection(Constants.USERS);
    const associations = client.connection.collection(Constants.ASSOCIATIONS);
    const routes = client.connection.collection(Constants.ROUTES);
    const landmarks = client.connection.collection(Constants.LANDMARKS);
    const dispatchRecords = client.connection.collection(Constants.DISPATCH_RECORDS);
    const panics = client.connection.collection(Constants.COMMUTER_PANICS);
    const notifications = client.connection.collection(Constants.NOTIFICATIONS)
    const chat = client.connection.collection(Constants.CHAT);
    const vehicles = client.connection.collection(Constants.VEHICLES);
    const cities = client.connection.collection(Constants.CITIES);


    const vehicleArrivals = client.connection.collection(Constants.VEHICLE_ARRIVALS);
    const vehicleDepartures = client.connection.collection(Constants.VEHICLE_DEPARTURES);
    const vehicleCommuterNearby = client.connection.collection(Constants.VEHICLE_COMMUTER_NEARBY);

    const commuterPickups = client.connection.collection(Constants.COMMUTER_PICKUP_LANDMARKS);
    const commuterArrivalLandmarks = client.connection.collection(Constants.COMMUTER_ARRIVAL_LANDMARKS);
    const commuterRequests = client.connection.collection(Constants.COMMUTER_REQUESTS);
    const commuterDwellEvents = client.connection.collection(Constants.COMMUTER_FENCE_DWELL_EVENTS);
    const commuterExitEvents = client.connection.collection(Constants.COMMUTER_FENCE_EXIT_EVENTS);
    const payments = client.connection.collection(Constants.PAYMENTS);
    //
    const paymentStream = payments.watch({ fullDocument: 'updateLookup' });
    const assocStream = associations.watch({ fullDocument: 'updateLookup' });
    const routeStream = routes.watch({ fullDocument: 'updateLookup' });
    const landmarkStream = landmarks.watch({ fullDocument: 'updateLookup' });
    const notificationsStream = notifications.watch({fullDocument: 'updateLookup'})
    const chatStream = chat.watch({ fullDocument: 'updateLookup' });
    const vehiclesStream = vehicles.watch({ fullDocument: 'updateLookup' });
    const cityStream = cities.watch({ fullDocument: 'updateLookup' });

    const dwellStream = commuterDwellEvents.watch({ fullDocument: 'updateLookup' });
    const exitStream = commuterExitEvents.watch({ fullDocument: 'updateLookup' });

    const commuterArrivalStream = commuterArrivalLandmarks.watch({ fullDocument: 'updateLookup' });
    const commuterRequestsStream = commuterRequests.watch({ fullDocument: 'updateLookup' });
    const commuterPickupsStream = commuterPickups.watch({ fullDocument: 'updateLookup' });

    const dispatchRecordsStream = dispatchRecords.watch({ fullDocument: 'updateLookup' });

    const usersStream = users.watch({ fullDocument: 'updateLookup' });
    const panicStream = panics.watch({ fullDocument: 'updateLookup' });

    const vehicleArrivalsStream = vehicleArrivals.watch({ fullDocument: 'updateLookup' });
    const vehicleDeparturesStream = vehicleDepartures.watch({ fullDocument: 'updateLookup' });
    const vehicleCommuterNearbyStream = vehicleCommuterNearby.watch({ fullDocument: 'updateLookup' });

    try {
      cityStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  cityStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendCity(event.fullDocument);
      });
      vehiclesStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehiclesStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendVehicleAdded(event.fullDocument);
      });
      vehicleCommuterNearbyStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehicleCommuterNearbyStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendVehicleCommuterNearby(event.fullDocument);
      });
      dwellStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  dwellStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendFenceDwellEvent(event.fullDocument);
      });
      //
      paymentStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  paymentStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendPayment(event.fullDocument);
      });
      // 
      notificationsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎 notificationsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        //  log(event)
         Messaging.sendNotification(event.fullDocument)
       });
       //
       chatStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎 chatStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
          );
          
            Messaging.sendChat(event.fullDocument);
            });
           //   
    exitStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  exitStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendFenceExitEvent(event.fullDocument);
      });
      //
      vehicleArrivalsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehicleArrivalsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendVehicleArrival(event.fullDocument);
      });
      //
      vehicleDeparturesStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehicleDeparturesStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendVehicleDeparture(event.fullDocument);
      });
      //
      commuterPickupsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  commuterPickupsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendCommuterPickupLandmark(event.fullDocument);
      });
      //
      panicStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendCommuterPanic(event.fullDocument);
      });
      //
      usersStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        Messaging.sendUser(event.fullDocument);
      });
      //
      assocStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`,
        );
        
        // Messaging.se
      });
      //
      routeStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `,
        );
        // Messaging.sendRoute(event.fullDocument);
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
          `\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 event: check fullDocument is not null: ${event}`,
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
    } catch (err) {
      console.error(`Problem with MongoDB change listeners`, err)
    }
  }

}


export default MongoListeners;
