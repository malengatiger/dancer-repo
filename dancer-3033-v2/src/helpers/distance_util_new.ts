
import { getDistance } from 'geolib';

class DistanceUtilNew {
  static calculateDistanceBetween(fromLat:Number, fromLng:Number, toLat:Number, toLng:Number) {
    const distance = getDistance(
      { latitude: fromLat.toString(), longitude: fromLng.toString() },
      { latitude: toLat.toString(), longitude: toLng.toString() }
    );
    return distance;
  }

  static findNearestRoutePoint(latitude:Number, longitude:Number, routePoints:any[]) {
    const list: any[] = [];
    routePoints.forEach((p) => {
      const dist = this.calculateDistanceBetween(
        latitude,
        longitude,
        p.position.coordinates[1],
        p.position.coordinates[0]
      );

      list.push({
        distance: dist,
        routePoint: p,
      });
    });

    //sort list and return if within 100 metres
    list.sort((a, b) => (a.distance > b.distance ? 1 : -1));
    console.log(
      ` 🥦 🥦 🥦 DistanceUtil: Nearest routePoint: ${
        list[0].distance
      } metres; ${JSON.stringify(list[0])}`
    );
    console.log(list[0]);
    console.log(list[1]);
    console.log(list[2]);

    return list[0].routePoint;
  }

  static calculateRouteLength(route:any) : Number {
    console.log(route);
    let total = 0.0;
    let index = 0;
    let prevPoint:any;
    route.routePoints.forEach((p:any) => {
      if (index > 0) {
        const dist = this.calculateDistanceBetween(
          prevPoint.position.coordinates[1],
          prevPoint.position.coordinates[0],
          p.position.coordinates[1],
          p.position.coordinates[0]
        );
        total += dist;
      }
      prevPoint = p;
      index++;
    });
    console.log(
      `💙 💙 💙 Mexico has paid for the wall!!! 💙 💙 💙 , Length of route: ${
        route.name
      } is 🏀 ${total} metres or 🏀 ${total / 1000} kilometres`
    );
    return total;
  }

  static reorder(route:any, landmarks:any) {
    console.log(
      `🧡 🧡 🧡 Sorting landmarks by distance from start of route 🍎 landmarks: ${landmarks.length}`
    );
    const distances:any[] = [];
    const landmarkPoints:any[] = [];
    route.routePoints.forEach((rp:any) => {
      if (rp.landmarkID) {
        landmarkPoints.push(rp);
      }
    });
    const start = route.routePoints[0]

    try {
      landmarks.forEach((landmark:any) => {
        const dist = this.calculateDistanceBetween(
          start.position.coordinates[1],
          start.position.coordinates[0],
          landmark.position.coordinates[1],
          landmark.position.coordinates[0]
        );
        distances.push({
            distance: dist,
            landmark: landmark
        })
      });
    } catch (error) {
      console.log(`😈 😈 😈 😈 There is some sort of fuckup here! returning unsorted landmarks`);
      console.error(error);
      return landmarks;
    }
    console.log(
      `🧡 🧡 🧡  about to sort calculated distances: ${distances.length} ...`
    );
    
    distances.sort((a, b) => (a.distance > b.distance ? 1 : -1));
    const sortedLandmarks:any[] = [];
   try {
    distances.forEach(d => {
      sortedLandmarks.push(d.landmark);
    });
   } catch (error) {
     console.error(error)
   }
    console.log(
      `🧡 🧡 🧡  ... Sorted landmarks by distance from start of route: 🍎 ${sortedLandmarks.length} 🍎 ...`
    );
   
    return sortedLandmarks;
  }
  static findLandmark(landmarkID: string, landmarks:any[]) {
    landmarks.forEach((m:any) => {
      console.log(`🌿 landmarkID: ${landmarkID} 🌿 m.landmarkID: ${m.landmarkID}`)
      const res:number = landmarkID.localeCompare(m.landmarkID) 
      console.log(`Result of localeCompare: ${res}`)
      if (res === 0) {
        console.log(`🌿🌿🌿🌿🌿🌿🌿 FOUND: landmarkID: ${landmarkID} 🌿 m.landmarkID: ${m.landmarkID}`)
        return m;
      }
    })
    console.log(`👿👿👿👿 landmark not found .... 👿 fuck!👿`)
    return null
  }
}
export default DistanceUtilNew;


