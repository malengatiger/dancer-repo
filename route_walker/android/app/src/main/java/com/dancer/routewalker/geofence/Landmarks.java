package com.dancer.routewalker.geofence;

import java.util.List;

public class Landmarks {
    private List<Landmark> landmarks;

    public Landmarks(List<Landmark> landmarks) {
        this.landmarks = landmarks;
    }

    public List<Landmark> getLandmarks() {
        return landmarks;
    }

    public void setLandmarks(List<Landmark> landmarks) {
        this.landmarks = landmarks;
    }
}
