"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const association_helper_1 = require("./helpers/association_helper");
const landmark_helper_1 = require("./helpers/landmark_helper");
const route_helper_1 = require("./helpers/route_helper");
class MongoListeners {
    static listen(client) {
        const associations = client.connection.collection("associations");
        const routes = client.connection.collection("routes");
        const landmarks = client.connection.collection("landmarks");
        console.log(`\n🔆 🔆 🔆  MongoListeners: 🧡  listening ... 👽 👽 👽 ${associations.collectionName}  👽 👽 👽 ${routes.collectionName}  👽 👽 👽  ${landmarks.collectionName}`);
        const assocStream = associations.watch();
        const routeStream = routes.watch();
        const landmarkStream = landmarks.watch();
        //
        assocStream.on("change", (event) => {
            // console.log(
            //   `\n🔆 🔆 🔆 🔆   🍎  assocStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
            // );
            association_helper_1.AssociationHelper.onAssociationAdded(event);
        });
        //
        routeStream.on("change", (event) => {
            // console.log(
            //   `\n🔆 🔆 🔆 🔆   🍎  routeStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
            // );
            route_helper_1.RouteHelper.onRouteAdded(event);
        });
        //
        landmarkStream.on("change", (event) => {
            // console.log(
            //   `\n🔆 🔆 🔆 🔆   🍎  landmarkStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
            // );
            landmark_helper_1.LandmarkHelper.onLandmarkAdded(event);
        });
    }
}
exports.default = MongoListeners;
//# sourceMappingURL=listeners.js.map