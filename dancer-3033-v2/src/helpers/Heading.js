class Heading {
    // Converts from degrees to radians.
static toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
  static toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  static eatShit() {
      console.log('💧💧💧 Eating shit now, Boss! 💧💧💧')
  }
  
  static getBearing(startLat, startLng, destLat, destLng) {
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);
  
    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    const brng = Math.atan2(y, x);
    const brng2 = this.toDegrees(brng);
    const result = (brng2 + 360) % 360;

    console.log(`🌺 🌸 🌼 Heading for the route is: ${result}`)
    return result;
  }
}

export default Heading