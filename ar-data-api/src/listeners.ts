import { AssociationHelper } from './helpers/association_helper';
import { LandmarkHelper } from "./helpers/landmark_helper";
import { RouteHelper } from "./helpers/route_helper";

class MongoListeners {
  public static listen(client) {
    const associations = client.connection.collection("associations");
    const routes = client.connection.collection("routes");
    const landmarks = client.connection.collection("landmarks");
    console.log(
      `\n🔆 🔆 🔆  MongoListeners: 🧡  listening ... 👽 👽 👽 ${
        associations.collectionName
      }  👽 👽 👽 ${routes.collectionName}  👽 👽 👽  ${landmarks.collectionName}`,
    );
    const assocStream = associations.watch();
    const routeStream = routes.watch();
    const landmarkStream = landmarks.watch();
    //
    assocStream.on("change", (event) => {
      // console.log(
      //   `\n🔆 🔆 🔆 🔆   🍎  assocStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
      // );
      AssociationHelper.onAssociationAdded(event);
    });
    //
    routeStream.on("change", (event) => {
      // console.log(
      //   `\n🔆 🔆 🔆 🔆   🍎  routeStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
      // );
      RouteHelper.onRouteAdded(event);
    });
    //
    landmarkStream.on("change", (event) => {
      // console.log(
      //   `\n🔆 🔆 🔆 🔆   🍎  landmarkStream onChange fired!  🍎  🔆 🔆 🔆 🔆 `,
      // );
      LandmarkHelper.onLandmarkAdded(event);
    });
  }
}
export default MongoListeners;
