package com.dancer.routewalker.geofence;

public class MessageBag {
    private String type, requestId, taxiMessage, geofenceType;

    public MessageBag(String type, String requestId, String taxiMessage, String geofenceType) {
        this.type = type;
        this.requestId = requestId;
        this.taxiMessage = taxiMessage;
        this.geofenceType = geofenceType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getTaxiMessage() {
        return taxiMessage;
    }

    public void setTaxiMessage(String taxiMessage) {
        this.taxiMessage = taxiMessage;
    }

    public String getGeofenceType() {
        return geofenceType;
    }

    public void setGeofenceType(String geofenceType) {
        this.geofenceType = geofenceType;
    }

   public static  final String TAXI_MESSAGE = "TAXI_MESSAGE",
            GEOFENCE_MESSAGE = "GEOFENCE_MESSAGE", DWELL = "DWELL", EXIT = "EXIT";
}
