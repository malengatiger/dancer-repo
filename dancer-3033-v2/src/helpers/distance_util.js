const geolib = require("geolib");

class DistanceUtil {
  calculateDistanceBetween(fromLat, fromLng, toLat, toLng) {
    const distance = geolib.getDistance(
      { latitude: fromLat, longitude: fromLng },
      { latitude: toLat, longitude: toLng }
    );
    return distance;
  }

  findNearestRoutePoint(latitude, longitude, routePoints) {
    const list = [];
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

    const routePoint = new RoutePoint(list[0].routePoint);
    return routePoint;
  }

  calculateRouteLength(route) {
    
    let total = 0.0;
    let index = 0;
    let prevPoint;
    route.routePoints.forEach((p) => {
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
      `💙 💙 💙 calculateRouteLength: Mexico has paid for the wall!!! 💙 , Length of route: ${
        route.name
      } is 🏀 ${total} metres or 🏀 ${total / 1000} kilometres`
    );
    return total;
  }

  reorder(route, landmarks) {
    console.log(
      `🧡 🧡 🧡 Sorting landmarks by distance from start of route 🍎 landmarks: ${landmarks.length}`
    );
    const distances = [];
    const landmarkPoints = [];
    route.routePoints.forEach((rp) => {
      if (rp.landmarkID) {
        landmarkPoints.push(rp);
      }
    });

    try {
      landmarkPoints.forEach((landmarkRoutePoint) => {
        //calculate dist from start of route
        let landmarkDistanceFromStart = 0.0;
        for (var i = 0; i < landmarkRoutePoint.index; i++) {
          const dist = this.calculateDistanceBetween(
            landmarkRoutePoint.position.coordinates[1],
            landmarkRoutePoint.position.coordinates[0],
            route.routePoints[i].position.coordinates[1],
            route.routePoints[i].position.coordinates[0],
          );
          // console.log(`calculated distance: ${dist} metres : ${landmarkRoutePoint.landmarkName}`)
          landmarkDistanceFromStart = landmarkDistanceFromStart + dist;
        }
        console.log(`🧡 🧡 calculated distance Landmark Point: ${landmarkDistanceFromStart} m: 🧡 ${landmarkRoutePoint.landmarkName}`);

        distances.push({
          distance: landmarkDistanceFromStart,
          landmarkID: landmarkRoutePoint.landmarkID,
          landmarkName: landmarkRoutePoint.landmarkName
        });
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
    console.log(distances)
    const sortedLandmarks = [];
   try {
    distances.forEach(d => {
      const mark = this.findLandmark(d.landmarkID, landmarks)
      console.log(`Found landmark: ${JSON.stringify(mark)}`)
      sortedLandmarks.push({
        landmarkID: d.landmarkID,
        landmarkName: d.landmarkName,
        // latitude:  d.position.coordinates[1],
        // longitude:  d.position.coordinates[0],
        // position: {
        //   coordinates: [d.position.coordinates[0], d.position.coordinates[1]]
        // }
      });
    });
   } catch (error) {
     console.error(error)
   }
    console.log(
      `🧡 🧡 🧡  ... Sorted landmarks by distance from start of route ...`
    );
    sortedLandmarks.forEach((m) => {
      console.log(`... Sorted landmark:  🧡 ${m.landmarkName}`);
    });
    console.log(sortedLandmarks)
    return sortedLandmarks;
  }
  findLandmark(landmarkID, landmarks) {
    landmarks.forEach(m => {
      console.log(`🌿 landmarkID: ${landmarkID} 🌿 m.landmarkID: ${m.landmarkID}`)
      const res = landmarkID.localeCompare(m.landmarkID) 
      console.log(`Result of localeCompare: ${res}`)
      if (res == 0) {
        console.log(`🌿🌿🌿🌿🌿🌿🌿 FOUND: landmarkID: ${landmarkID} 🌿 m.landmarkID: ${m.landmarkID}`)
        return m;
      }
    })
    console.log(`👿👿👿👿 landmark not found .... 👿 fuck!👿`)
    return null
  }
}

export default DistanceUtil;
