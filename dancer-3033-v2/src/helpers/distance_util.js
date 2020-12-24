

const geolib = require("geolib");

class DistanceUtil {
  calculateDistanceBetween(fromLat, fromLng, toLat, toLng) {
    console.log(`🌿🌿🌿 Calculating distance between 2 points`)
    const distance = geolib.getDistance(
        { latitude: fromLat, longitude: fromLng }, 
        { latitude: toLat, longitude: toLng });
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
    log(list[0]);
    log(list[1]);
    log(list[2]);

    const routePoint = new RoutePoint(list[0].routePoint)
    return routePoint;
  }

  calculateRouteLength(route) {
    console.log(route);
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
      `💙 💙 💙 Mexico has paid for the wall!!! 💙 💙 💙 , Length of route: ${route.name} is 🏀 ${total} metres or 🏀 ${
        total / 1000
      } kilometres`
    );
    return total;
  }

  reorder(route, landmarks) {
    console.log(`🧡 🧡 🧡 Sorting landmarks by distance from start of route 🍎 landmarks: ${landmarks.length}`)
    const distances = [];
    const start = route.routePoints[0];
    console.log(start)
   
    try {
      landmarks.forEach((landmark) => {
        console.log(landmark)
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
      console.log(`😈 😈 😈 😈 There is some sort of fuckup here!`)
      console.error(error)
      return landmarks
    }
    console.log(`🧡 🧡 🧡  about to sort calculated distances: ${distances.length} ...`)
    distances.sort((a, b) => (a.distance > b.distance ? 1 : -1));
    const sortedLandmarks = []
    distances.forEach(d => {
      sortedLandmarks.push(d.landmark)
    })
    console.log(`🧡 🧡 🧡 Sorted landmarks by distance from start of route ...`)
    sortedLandmarks.forEach(m => {
      console.log(m)
    })
    return sortedLandmarks
  }
}
export default DistanceUtil;
