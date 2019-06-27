import { DocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";
import { firestore } from "firebase-admin";
import v1 from "uuid/v1";
import Association from "../models/association";
import Route from "../models/route";
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
export class RouteHelper {
  public static async onRouteAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  route in stream:  🍀  🍀  🍎 `,
    );
  }
  public static async deleteRoutePoints(routeID: string): Promise<any> {
    console.log(`Deleting route points for routeID: ${routeID}`);
    const qs: QuerySnapshot = await firestore().collection('newRoutes')
    .doc(routeID).collection('rawRoutePoints').get()

    await deleteCollection(firestore(), `newRoutes/${routeID}/rawRoutePoints`, 200);
    console.log(`${qs.docs.length} route points deleted from routeID: ${routeID}`);
    return 0;

    function deleteCollection(db: any, collectionPath: any, batchSize: any) {
      let collectionRef = db.collection(collectionPath);
      let query = collectionRef.orderBy('__name__').limit(batchSize);
    
      return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    }
    
    function deleteQueryBatch(db: any, query: any, batchSize: number, resolve: any, reject: any) {
      query.get()
        .then((snapshot: any) => {
          // When there are no documents left, we are done
          if (snapshot.size == 0) {
            console.log(` 💦 💦 💦 deleteQueryBatch done ❤️ ❤️ for routeID: ${routeID}`);
            return 0;
          }
    
          // 
          console.log(`deleteQueryBatch:  💦 💦 💦 Delete documents in a batch for routeID: ${routeID}`);
          let batch = db.batch();
          snapshot.docs.forEach((doc: any) => {
            batch.delete(doc.ref);
          });
    
          return batch.commit().then(() => {
            return snapshot.size;
          });
        }).then((numDeleted: any) => {
          if (numDeleted === 0) {
            resolve();
            return;
          }
          // Recurse on the next process tick, to avoid
          // exploding the stack.
          process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
          });
        })
        .catch(reject);
    }
    
  }
  public static async addRoute(
    name: string,
    assocs: string[],
    color: string,
  ): Promise<any> {

    const routeModel = new Route().getModelForClass(Route);
    const assModel = new Association().getModelForClass(Association);
    const list1: any[] = [];
    const list2: any[] = [];

    for (const id of assocs) {
      const ass = await assModel.findByAssociationID(id);
      if (ass) {
        list1.push(ass.associationID);
        list2.push({
          associationID: ass.associationID,
          associationName: ass.associationName,
        });
      }
    }

    if (!color) {
      color = "BLUE";
    }
    const routeID = v1();
    const route = new routeModel({
      associationDetails: list2,
      associationIDs: list1,
      color,
      name,
      routeID,
    });
    const m = await route.save();
    console.log(
      `\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`,
    );
    return m;
  }

  public static async getRoutes(): Promise<any> {
    console.log(` 🌀 getRoutes find all routes in Mongo ....   🌀  🌀  🌀 `);
    const routeModel = new Route().getModelForClass(Route);
    const list = await routeModel.find();
    return list;
  }
}
