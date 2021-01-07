package com.dancer.routewalker;

import com.google.android.gms.maps.model.LatLng;

import java.util.List;

public interface LatListener {
    void onDirections(List<LatLng> list);
    void onString(String json);
    void onError(String message);
}
