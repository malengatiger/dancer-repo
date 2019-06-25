import { CollectionReference, Firestore, Query, QuerySnapshot } from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import polyline from "google-polyline";
import { AssociationHelper } from "../helpers/association_helper";
import { RouteHelper } from "../helpers/route_helper";
import { VehicleHelper } from "../helpers/vehicle_helper";
import { CommuterRequestHelper } from "./../helpers/commuter_request_helper";
import { CityHelper, CountryHelper } from "./../helpers/country_helper";
import { LandmarkHelper } from "./../helpers/landmark_helper";
const z = "\n";
console.log(
  `\n\n👺 👺 👺 🔑 Migrator: getting serviceAccount from json file  🔑 🔑...`,
);
// tslint:disable-next-line: no-var-requires
const serviceAccount1 = require("../../ar.json");
const serviceAccount2 = require("../../dancer.json");

// tslint:disable-next-line: no-var-requires
const citiesJson = require("../../cities.json");
console.log(citiesJson);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌  `);
console.log(serviceAccount1);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌 `);
console.log(serviceAccount2);
console.log(`serviceAccount: 😍 😍 😍 ...`);
const appFrom = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount1),
  databaseURL: "https://aftarobot2019-dev3.firebaseio.com",
}, 'appFrom');
console.log(`🔑🔑🔑 appFrom = admin.initializeApp done: 😍 😍 😍 ... ${appFrom.name}`);
const  appTo = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount2),
  databaseURL: "https://dancer-3303.firebaseio.com",
}, 'appTo');
console.log(`🔑🔑🔑 appTo = admin.initializeApp done: 😍 😍 😍 ... ${appTo.name}`);

export const fs1: Firestore = appFrom.firestore();
export const fs2: Firestore = appTo.firestore();
console.log(`${z}💋  💋  💋  Migrator: -- firebase admin initialized; 💦 
${appFrom.name} ❤️  from SDK_VERSION: ${
  admin.SDK_VERSION
}  😍 😍 😍 ${new Date().toUTCString()}`);
console.log(`${z}💋  💋  💋  Migrator: -- firebase admin initialized; 💦 
${appTo.name} ❤️  to SDK_VERSION: ${
  admin.SDK_VERSION
}  😍 😍 😍 ${new Date().toUTCString()}`);

async function getCollections() {
  console.log(
    `\n🌸  🌸  🌸 Getting list of collections from  🌸 Firestore ...\n`,
  );
  const colRef: CollectionReference[] = await fs1.listCollections();
  console.log(`${z}💦 💦 💦 💦 collections in Firestore FROM database: \n\n`);
  colRef.forEach((m) => {
    console.log(
      `❤️ ❤️ ❤️   Firestore FROM collection:  💦 ${m.doc().path.split("/")[0]}`,
    );
  });
  console.log(`${z}💦 💦 💦 💦 all FROM collections listed: \n\n`);
  const colRef2: CollectionReference[] = await fs2.listCollections();
  console.log(`${z}💦 💦 💦 💦 collections in Firestore TO database: \n\n`);
  colRef2.forEach((m) => {
    console.log(
      `🌽 🌽 🌽   Firestore TO collection:  💦 ${m.doc().path.split("/")[0]}`,
    );
  });
  console.log(`${z}💦 💦 💦 💦 all TO collections listed: \n\n`);
}

getCollections();

// 5ced8952fc6e4ef1f1cfc7ae = countryID
// TODO - ♻️ ♻️ build route point migration : May 30, 2019
// TODO - 🌸 🌸 migrate the rest of Firestore database -  🌸  🌸  🌸
class Migrator {
  public static async start() {
    console.log(`\n\n......Migrator is starting up ... ❤️  ❤️  ❤️  ....\n`);
    const start = new Date().getTime();

    // await this.migrateCountries();
    // await this.migrateAssociations();
    // await this.migrateCities("5ced8952fc6e4ef1f1cfc7ae");
    // await this.migrateVehicleTypes();
    // await this.migrateVehicles();
    //await this.migrateRoutes();
    // await this.migrateCommuterRequests();
    // await this.encodePolyline();
    //await this.toDancer();
    await this.landmarksToDancer();

    const end = new Date().getTime();
    console.log(
      `\n\n♻️ ♻️ ♻️ ♻️ ♻️ ♻️  Migrator has finished the job:  ❤️  ${(end -
        start) /
        1000} seconds elapsed\n\n`,
    );

    return {
      migrator: `❤️️ ❤️ ❤️   Migrator has finished the job!  ❤️  ${(end -
        start) /
        1000} seconds elapsed  ❤️ ❤️ ❤️`,
      xdate: new Date(),
    };
  }

  public static async landmarksToDancer(): Promise<any> {
    console.log(`\n\n\n🍎 🍎 migrating landmarks to Dancer ....  🍎 \n\n`);
    const qs1 = await fs1.collection('newLandmarks').get();
    let cnt = 0;
    for (const doc of qs1.docs) {
      const id = doc.data().landmarkID;
      await fs2.collection('newLandmarks').doc(id).set(doc.data());
      cnt++;
      console.log(`🧡🧡 landmark #${cnt} added ${doc.data().landmarkName}  🍎🍎 \n\n`);
    }
    console.log(`\n\n🧡🧡🧡🧡🧡🧡 ${cnt} landmarks added:  🍎\n\n`);
  }
  public static async toDancer(): Promise<any> {
    console.log(`\n\n\n🍎 🍎 migrating data to Dancer ....  🍎 \n\n`);
    const qs1 = await fs1.collection('associations').get();
    for (const doc of qs1.docs) {
      const id = doc.data().associationID;
      await fs2.collection('associations').doc(id).set(doc.data());
      console.log(`🧡🧡 association added ${doc.data().associationName}  🍎🍎 \n\n`);
    }
    const qs2 = await fs1.collection('newRoutes').get();
    for (const doc of qs2.docs) {
      const id = doc.data().routeID;
      await fs2.collection('newRoutes').doc(id).set(doc.data());
      let cnt = 0, cnt2 = 0;
      const qs3 = await doc.ref.collection('rawRoutePoints').get();
      for (const m of qs3.docs) {
        await fs2.collection('newRoutes').doc(id).collection('rawRoutePoints').add(m.data());
        cnt++;
        
      }
      const qs4 = await doc.ref.collection('routePoints').get();
      for (const m of qs4.docs) {
        await fs2.collection('newRoutes').doc(id).collection('routePoints').add(m.data());
        cnt2++;
        
      }
      console.log(`rawRoutePoints added:  🍎 ${cnt} routePoints added:  🍎 ${cnt2}`);
      console.log(`🧡🧡 route added ${doc.data().name} 🧡🧡\n\n`);
    }
  }

  public static async encodePolyline() {
    const routeID = "-LgWJGYelWehA41IfbsS";
    const qs = await fs1
      .collection("newRoutes")
      .doc(routeID)
      .collection("routePoints")
      .get();
    console.log(`....... Firestore routePoints found:  🍎 ${qs.docs.length}`);

    const points: any = [];
    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      cnt++;
      points.push([data.latitude, data.longitude]);
    }
    const encoded = polyline.encode(points);
    console.log(
      `🌸  🌸  🌸  encoded polyline:  🍀 ${encoded}  🍀 length: ${
        encoded.length
      }`,
    );
    console.log(`\n🔑 🔑 🔑   route points encoded:  🍀  ${cnt}  🍀`);
  }
  public static async migrateCommuterRequests(): Promise<any> {
    console.log(`\n\n🍎  Migrating commuter requests ........................`);
    const qs = await fs1.collection("commuterRequests").get();
    console.log(
      `....... Firestore commuterRequests found:  🍎 ${qs.docs.length}`,
    );

    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      cnt++;

      if (data.fromLandmarkId && data.routeId) {
        const cr = await CommuterRequestHelper.addCommuterRequest(data);
        console.log(
          ` 🍀 🍀 🍀 #${cnt} commuter request migrated:  🍀 ${cr.createdAt}`,
        );
      } else {
        console.log(`👿 some data missing, #${cnt} 👿👿👿 IGNORED`);
      }
    }
    console.log(
      `\n🔑 🔑 🔑   commuterRequests migrated:  🍀  ${qs.docs.length}  🍀`,
    );
  }
  public static async migrateCountries(): Promise<any> {
    console.log(`\n\n🍎  Migrating countries ........................`);
    const qs = await fs1.collection("countries").get();
    console.log(`....... Firestore countries found:  🍎 ${qs.docs.length}`);

    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      const country = await CountryHelper.addCountry(
        data.name,
        data.countryCode,
      );
      this.countries.push(country);
      console.log(country);
    }
    console.log(`\n🔑 🔑 🔑   countries migrated: ${this.countries.length}`);
    for (const c of this.countries) {
      if (c.name === "South Africa") {
        console.log(c);
        await this.migrateCities(c.countryID);
      }
    }
  }
  public static async migrateCities(countryID: string): Promise<any> {
    console.log(
      `\n\n🍎 🍎 🍎  Migrating cities, 🍎 countryID: ${countryID} ....... 🍎 🍎 🍎 `,
    );
    const start = new Date().getTime();
    // tslint:disable-next-line: forin
    let cnt = 0;
    // tslint:disable-next-line: forin
    for (const m in citiesJson) {
      const city: any = citiesJson[m];
      const x = await CityHelper.addCity(
        city.name,
        city.provinceName,
        countryID,
        "South Africa",
        city.latitude,
        city.longitude,
      );
      cnt++;
      console.log(
        `🌳 🌳 🌳  city #${cnt}  added to Mongo: 🍎 id: ${x.countryID}  🍎 ${
          city.name
        }  💛  ${city.provinceName}  📍 📍 ${city.latitude}  📍  ${
          city.longitude
        }`,
      );
    }
    const end = new Date().getTime();
    console.log(
      `\n\n💛 💛 💛 💛 💛 💛   Cities migrated: ${end -
        start / 1000} seconds elapsed`,
    );
  }
  public static async migrateAssociations(): Promise<any> {
    console.log(`\n\n🍎  Migrating associations .............`);
    const qs = await fs1.collection("associations").get();
    console.log(`associations found:  🍎  ${qs.docs.length}`);

    const countryID = "75758d10-8b0b-11e9-af98-9b65797ec338";
    const countryName = "South Africa";
    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      await AssociationHelper.addAssociation(
        data.associationName,
        "info@association.com",
        data.phone,
        countryID,
        countryName,
      );
      cnt++;
    }
    console.log(`\n🎸  🎸  🎸  associations added to Mongo: 🎀 ${cnt}`);
  }
  public static async migrateVehicles(): Promise<any> {
    console.log(`\n\n🍎  Migrating vehicles ............. 🍎🍎🍎`);
    const qs = await fs1.collection("vehicles").get();
    console.log(`🍎  Firestore vehicles found:  🍎  ${qs.docs.length}`);

    // get assocs from mongo
    const assocs: any = await AssociationHelper.getAssociations();
    console.log(`👽 👽 ${assocs.length} Associations from Mongo`);

    const vehicleTypeID = "45f2d1f0-8b1b-11e9-8cde-f7926ecb6f9c";
    let cnt = 0;
    for (const doc of qs.docs) {
      const vehicle: any = doc.data();
      for (const association of assocs) {
        if (association.associationName === vehicle.associationName) {
          await VehicleHelper.addVehicle(
            vehicle.vehicleReg,
            association.associationID,
            association.associationName,
            null,
            vehicle.ownerName,
            vehicleTypeID,
            [],
          );
          cnt++;
          console.log(` 🧡 🧡  vehicle #${cnt} added`);
        }
      }
    }
    console.log(`\n🎸  🎸  🎸  vehicles migrated to Mongo: 🎀 ${cnt} \n\n`);
  }
  public static async migrateVehicleTypes(): Promise<any> {
    console.log(`\n\n🍎  Migrating vehicleTypess .............`);
    const qs = await fs1.collection("vehicleTypes").get();
    console.log(`vehicleTypes found:  🍎  ${qs.docs.length}`);

    const countryID = "75758d10-8b0b-11e9-af98-9b65797ec338";
    const countryName = "South Africa";
    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      await VehicleHelper.addVehicleType(
        data.make,
        data.model,
        data.capacity,
        countryID,
        countryName,
      );
      cnt++;
    }
    console.log(`\n🎸  🎸  🎸  vehicleTypes added to Mongo: 🎀 ${cnt}`);
  }
  public static async migrateRoutes(): Promise<any> {
    console.log(`\n\n🍎  Migrating routes ............. 🍎🍎🍎\n\n`);
    const s = new Date().getTime();
    const routesQuerySnap: QuerySnapshot = await fs1.collection("newRoutes").get();
    console.log(
      `🍎  Firestore routes found:  🍎  ${routesQuerySnap.docs.length}`,
    );
    const landmarksQuerySnap: QuerySnapshot = await fs1.collection("newLandmarks").get();
    console.log(
      `🍎  Firestore landmarks found:  🍎  ${landmarksQuerySnap.docs.length}`,
    );

    // get assocs from mongo
    const assocs: any = await AssociationHelper.getAssociations();
    console.log(
      `\n\nmigrateRoutes: 👽 👽 👽 👽 👽 👽 👽 👽  ${
        assocs.length
      } Associations from Mongo 💛 💛\n\n`,
    );

    let cnt = 0;
    for (const doc of routesQuerySnap.docs) {
      const route: any = doc.data();
      for (const association of assocs) {
        if (route.associationNames) {
          if (
            this.isAssociationFound(
              route.associationNames,
              association.associationName,
            )
          ) {
            await this.processRoute(route, association, cnt, landmarksQuerySnap);
            cnt++;
          }
        } else {
          if (route.associationName === association.associationName) {
            await this.processRoute(route, association, cnt, landmarksQuerySnap);
            cnt++;
          }
        }
      }
    }
    const e = new Date().getTime();
    const elapsed = `\n🎁 🎁 🎁  Migration took ${(e - s) /
      100} elapsed seconds 🎁 🎁 🎁`;
    console.log(`\n🎸  🎸  🎸  routes migrated to Mongo: 🎀  \n`);
    console.log(`\n🎸  🎸  🎸  landmarks migrated to Mongo: 🎀  \n\n`);

    console.log(elapsed);
  }
  private static countries: any = [];

  private static async processRoute(route, association, cnt, landmarksQuerySnapshot: QuerySnapshot) {
    console.log(`💛 💛 💛 about to call: RouteHelper.addRoute(): 🎀 ${route.name}`);
    const mRoute = await RouteHelper.addRoute(
      route.name,
      [association.associationID],
      route.color,
    );
    cnt++;
    console.log(
      `\n💛 💛 💛  Migrator: route #${cnt} added  💛 ${mRoute.name}, will do the  landmarks ...\n`,
    );
    // get all route landmarks by name and migrate
    console.log(mRoute);
    this.processRouteLandmarks(mRoute, landmarksQuerySnapshot);
  }
  private static isAssociationFound(
    associations: string[],
    associationID: string,
  ): boolean {
    let isFound = false;
    associations.forEach((ass) => {
      if (ass === associationID) {
        isFound = true;
      }
    });
    return isFound;
  }
  private static isRouteFound(
    routeNames: any[],
    name: string,
  ): boolean {
    let isFound = false;
    routeNames.forEach((routeDetail) => {
      if (routeDetail.name === name) {
        isFound = true;
      }
    });
    return isFound;
  }
  private static async processRouteLandmarks(mRoute, landmarksQuerySnapshot: QuerySnapshot) {
    console.log(
      `\n\nroute ....... about to loop thru ${landmarksQuerySnapshot.docs.length} landmarks ... 😍 ${mRoute.name} \n`,
    );

    const landmarks: any = [];
    for (const mdoc of landmarksQuerySnapshot.docs) {
      const old = mdoc.data();
      const routeNames: [any] = old.routeNames;
      if (this.isRouteFound(routeNames, mRoute.name)) {
        landmarks.push({
          landmarkName: old.landmarkName,
          latitude: old.latitude,
          longitude: old.longitude,
        });
      }
    }
    console.log(
      `\nsending 🎀 🎀 🎀 🎀 🎀 🎀 ${landmarks.length} landmarks; route: (${
        mRoute.name
      }) to mongo`,
    );
    for (const mark of landmarks) {
      await LandmarkHelper.addLandmark(
        mark.landmarkName,
        mark.latitude,
        mark.longitude,
        [mRoute.routeID],
        [{routeID: mRoute.routeID, name: mRoute.name}],
      );
    }
  }
}

export default Migrator;
