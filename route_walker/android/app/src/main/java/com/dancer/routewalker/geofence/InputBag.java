package com.dancer.routewalker.geofence;


import com.dancer.routewalker.util.VehicleDTO;

import java.util.List;

public class InputBag {
    private VehicleDTO vehicle;
    private List<Landmark> landmarks;

    public VehicleDTO getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleDTO vehicle) {
        this.vehicle = vehicle;
    }

    public List<Landmark> getLandmarks() {
        return landmarks;
    }

    public void setLandmarks(List<Landmark> landmarks) {
        this.landmarks = landmarks;
    }
}
