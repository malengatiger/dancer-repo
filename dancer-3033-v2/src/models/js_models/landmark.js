class Landmark {
    landmarkID;
    landmarkName;
    latitude;
    longitude;
    position;
    created;
    routeDetails;
    cities;
  
    constructor(data) {
      Object.assign(this, data);
    }
  }

  export default Landmark