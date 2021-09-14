import Constants from "../helpers/constants";
import Messaging from "./messaging";
import { log } from "../log";

class MongoListeners {
  public static listen(client: any) {
    log(
      `\n🔆🔆🔆  MongoListeners: listening to changes in collections ... 👽👽👽\n`
    );

    const users = client.connection.collection(Constants.USERS);
    const associations = client.connection.collection(Constants.ASSOCIATIONS);
    const routes = client.connection.collection(Constants.ROUTES);
    const landmarks = client.connection.collection(Constants.LANDMARKS);
    const dispatchRecords = client.connection.collection(
      Constants.DISPATCH_RECORDS
    );
    const panics = client.connection.collection(Constants.COMMUTER_PANICS);
    const notifications = client.connection.collection(Constants.NOTIFICATIONS);
    const chat = client.connection.collection(Constants.CHAT);
    const vehicles = client.connection.collection(Constants.VEHICLES);
    const cities = client.connection.collection(Constants.CITIES);

    const commands = client.connection.collection(Constants.VEHICLE_COMMANDS);
    const commandResponses = client.connection.collection(Constants.VEHICLE_COMMAND_RESPONSES);

    const vehicleArrivals = client.connection.collection(
      Constants.VEHICLE_ARRIVALS
    );
    const vehicleDepartures = client.connection.collection(
      Constants.VEHICLE_DEPARTURES
    );
    const vehicleCommuterNearby = client.connection.collection(
      Constants.VEHICLE_COMMUTER_NEARBY
    );

    const commuterPickups = client.connection.collection(
      Constants.COMMUTER_PICKUP_LANDMARKS
    );
    const commuterArrivalLandmarks = client.connection.collection(
      Constants.COMMUTER_ARRIVAL_LANDMARKS
    );
    const commuterRequests = client.connection.collection(
      Constants.COMMUTER_REQUESTS
    );
    const commuterDwellEvents = client.connection.collection(
      Constants.COMMUTER_FENCE_DWELL_EVENTS
    );
    const commuterExitEvents = client.connection.collection(
      Constants.COMMUTER_FENCE_EXIT_EVENTS
    );
    const payments = client.connection.collection(Constants.PAYMENTS);
    const settings = client.connection.collection(Constants.SETTINGS);
    //
    const paymentStream = payments.watch({ fullDocument: "default" });
    const assocStream = associations.watch({ fullDocument: "default" });
    const routeStream = routes.watch({ fullDocument: "default" });
    const landmarkStream = landmarks.watch({ fullDocument: "default" });

    const commandStream = commands.watch({ fullDocument: "default" });
    const commandResponseStream = commandResponses.watch({ fullDocument: "default" });

    const notificationsStream = notifications.watch({
      fullDocument: "default",
    });
    const chatStream = chat.watch({ fullDocument: "default" });
    const vehiclesStream = vehicles.watch({ fullDocument: "default" });
    const cityStream = cities.watch({ fullDocument: "default" });
    const settingsStream = settings.watch({ fullDocument: "default" });
    const dwellStream = commuterDwellEvents.watch({ fullDocument: "default" });
    const exitStream = commuterExitEvents.watch({ fullDocument: "default" });

    const commuterArrivalStream = commuterArrivalLandmarks.watch({
      fullDocument: "default",
    });
    const commuterRequestsStream = commuterRequests.watch({
      fullDocument: "default",
    });
    const commuterPickupsStream = commuterPickups.watch({
      fullDocument: "default",
    });

    const dispatchRecordsStream = dispatchRecords.watch({
      fullDocument: "default",
    });

    const usersStream = users.watch({ fullDocument: "default" });
    const panicStream = panics.watch({ fullDocument: "default" });

    const vehicleArrivalsStream = vehicleArrivals.watch({
      fullDocument: "default",
    });
    const vehicleDeparturesStream = vehicleDepartures.watch({
      fullDocument: "default",
    });
    const vehicleCommuterNearbyStream = vehicleCommuterNearby.watch({
      fullDocument: "default",
    });

    try {
      // commandStream.on("change", (event: any) => {
      //   log(
      //     `\n🔆🔆🔆🔆 🍎 commandStream onChange fired! 🍎 🔆🔆🔆🔆`
      //   );

      //   Messaging.sendVehicleCommand(event.fullDocument);
      // });
      // commandResponseStream.on("change", (event: any) => {
      //   log(
      //     `\n🍐🍐🍐🍐 🍎 commandResponseStream onChange fired! 🍎 🍐🍐🍐🍐`
      //   );

      //   Messaging.sendVehicleCommandResponse(event.fullDocument);
      // });
      settingsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆 🍎 settingsStream onChange fired! 🍎 🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendSettings(event.fullDocument);
      });
      cityStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  cityStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendCity(event.fullDocument);
      });
      vehiclesStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehiclesStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendVehicleAdded(event.fullDocument);
      });
      vehicleCommuterNearbyStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  vehicleCommuterNearbyStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendVehicleCommuterNearby(event.fullDocument);
      });
      dwellStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  dwellStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendFenceDwellEvent(event.fullDocument);
      });
      //
      paymentStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  paymentStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendPayment(event.fullDocument);
      });
      //
      notificationsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎 notificationsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );
        //  log(event)
        Messaging.sendNotification(event.fullDocument);
      });
      //
      chatStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎 chatStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendChat(event.fullDocument);
      });
      //
      exitStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  exitStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendFenceExitEvent(event.fullDocument);
      });
      //
      // vehicleArrivalsStream.on("change", (event: any) => {
      //   log(
      //     `\n🔆🔆🔆🔆   🍎  vehicleArrivalsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
      //       event._id
      //     )}`
      //   );

      //   Messaging.sendVehicleArrival(event.fullDocument);
      // });
      // //
      // vehicleDeparturesStream.on("change", (event: any) => {
      //   log(
      //     `\n🔆🔆🔆🔆   🍎  vehicleDeparturesStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
      //       event._id
      //     )}`
      //   );

      //   Messaging.sendVehicleDeparture(event.fullDocument);
      // });
      //
      commuterPickupsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  commuterPickupsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendCommuterPickupLandmark(event.fullDocument);
      });
      //
      panicStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendCommuterPanic(event.fullDocument);
      });
      //
      usersStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );

        Messaging.sendUser(event.fullDocument);
      });
      //
      assocStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(
            event._id
          )}`
        );
      });
      //
      routeStream.on("change", (event: any) => {
        log(`\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `);
        Messaging.sendRoute(event.fullDocument);
      });
      //
      landmarkStream.on("change", (event: any) => {
        log(`\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `);
        Messaging.sendLandmark(event.fullDocument);
      });
      //
      commuterArrivalStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `
        );
        Messaging.sendCommuterArrivalLandmark(event.fullDocument);
      });
      //
      commuterRequestsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 event: check fullDocument is not null: ${event}`
        );
        Messaging.sendCommuterRequest(event.fullDocument);
      });
      //
      dispatchRecordsStream.on("change", (event: any) => {
        log(
          `\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `
        );
        Messaging.sendDispatchRecord(event.fullDocument);
      });
    } catch (err) {
      console.error(`Problem with MongoDB change listeners`, err);
    }
  }
}

export default MongoListeners;
