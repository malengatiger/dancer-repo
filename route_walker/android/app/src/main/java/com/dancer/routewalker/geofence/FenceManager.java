package com.dancer.routewalker.geofence;

import android.Manifest;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;


public class FenceManager {
    private static final String TAG = "\uD83C\uDF40\uD83C\uDF40 " + FenceManager.class.getSimpleName();
    private static final int GEOFENCE_EXPIRATION_IN_MILLISECONDS = 6000 * 1000,
            GEOFENCE_RADIUS_IN_METERS = 200, GEOFENCE_LOITERING_DELAY = 2000;

    private final List<Geofence> geoFenceList = new ArrayList<>();
    private final GeofencingClient geofencingClient;

    public FenceManager(GeofencingClient client) {
        geofencingClient = client;
        Log.d(TAG, " \uD83D\uDD06 \uD83D\uDD06 geofencingClient:on construction, id: " + geofencingClient.toString());
    }


    public void buildLandmarkGeofences(final List<Landmark> landmarks, final Activity activity, final Context context) {
        if (landmarks.isEmpty()) {
            Log.d(TAG, "buildLandmarkGeofences:  \uD83D\uDD06 \uD83D\uDD06 empty landmark list, quitting ..........");
            return;
        }
        Log.d(TAG, "\uD83D\uDD06 \uD83D\uDD06 buildLandmarkGeofences: \uD83D\uDD06 \uD83D\uDD06 " + landmarks.size() + " landmarks");
        HashMap<String, Landmark> mMap = new HashMap<>();
        for (Landmark landmark : landmarks) {
            mMap.put(landmark.landmarkID, landmark);
        }
       Collection<Landmark> coll = mMap.values();
        List<Landmark> marks = new ArrayList<>(coll);

        getGeofencePendingIntent(context);
        geofencingClient.removeGeofences(geofencePendingIntent).addOnSuccessListener(aVoid -> {
            Log.d(TAG, "\uD83D\uDD06 \uD83D\uDD06 geofencingClient:removeGeofences onSuccess: \uD83D\uDD06 \uD83D\uDD06");
            startGeofencing(marks, activity);
        }).addOnFailureListener(e -> {
            Log.d(TAG, " \uD83D\uDD06 \uD83D\uDD06 geofencingClient:removeGeofences onFailure:");
            //broadcast message back
        });

    }

    private GeofencingRequest getGeofencingRequest() {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_DWELL);
        builder.addGeofences(geoFenceList);
        return builder.build();
    }


    private void startGeofencing(List<Landmark> landmarks, Activity activity) {
        geoFenceList.clear();
        for (Landmark m : landmarks) {
            createFence(m);
        }

        Log.i(TAG, "\uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 startGeofencing: landmarks: " + geoFenceList.size());
        GeofencingRequest geofencingRequest = getGeofencingRequest();

        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        Log.i(TAG, "\uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 " +
                "startGeofencing: \uD83C\uDF4E \uD83C\uDF4E \uD83C\uDF4E " +
                "adding geofences to geofenceClient: ");
        geofencingClient.addGeofences(geofencingRequest, geofencePendingIntent)
        .addOnCompleteListener(task -> {
            Log.i(TAG, "\uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 addGeofences:: " +
                    "addOnCompleteListener: task.isComplete: " + task.isComplete());
        })
        .addOnSuccessListener(aVoid -> Log.i(TAG, "\uD83D\uDD06 \uD83D\uDD06 \uD83C\uDF3A \uD83C\uDF3A \uD83C\uDF3A " +
                "addGeofences:addOnSuccessListener: \uD83D\uDD06 \uD83D\uDD06 onSuccess  "))
        .addOnFailureListener(e -> {
            Log.i(TAG, "\uD83D\uDD06 \uD83D\uDD06 \uD83C\uDF3A \uD83C\uDF3A \uD83C\uDF3A" +
                    " addGeofences: onFailure  " + e.getMessage());
            e.printStackTrace();

        });

    }

    private void createFence(Landmark landmark) {
        if (geoFenceList.size() > 99) {
            Log.e(TAG, "createFence: \uD83D\uDC7F \uD83D\uDC7F \uD83D\uDC7F " +
                    "TOO MANY FENCES -- have reached 100 fences ... \uD83D\uDC7F \uD83D\uDC7F \uD83D\uDC7F" );
            return;
        }

        geoFenceList.add(new Geofence.Builder()
                .setRequestId(landmark.getLandmarkID() + "@" + landmark.landmarkName)
                .setCircularRegion(
                        landmark.latitude,
                        landmark.longitude,
                        GEOFENCE_RADIUS_IN_METERS
                )
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setNotificationResponsiveness(GEOFENCE_LOITERING_DELAY)
                .setTransitionTypes(
                        Geofence.GEOFENCE_TRANSITION_EXIT | Geofence.GEOFENCE_TRANSITION_DWELL)
                .setLoiteringDelay(GEOFENCE_LOITERING_DELAY)
                .build());

        Log.d(TAG, "\uD83D\uDC99 \uD83D\uDC99 createFence: geofence added \uD83D\uDC99 : "
                + landmark.landmarkName +  ", geoFenceList: " + geoFenceList.size()
                + "  \uD83D\uDD06 \uD83D\uDD06 landmarkID: " + landmark.landmarkID);
    }

    private PendingIntent geofencePendingIntent;

    private void getGeofencePendingIntent(Context context) {
        // Reuse the PendingIntent if we already have it.
        if (geofencePendingIntent != null) {
            return;
        }
        Intent intent = new Intent(context, FenceBroadcastReceiver.class);
        geofencePendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.
                FLAG_UPDATE_CURRENT);
    }


}
