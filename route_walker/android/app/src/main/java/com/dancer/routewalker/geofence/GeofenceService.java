package com.dancer.routewalker.geofence;

import android.content.Intent;
import android.util.Log;

import androidx.core.app.JobIntentService;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

public class GeofenceService extends JobIntentService {
    private static final String IDENTIFIER = "GeofenceService \uD83D\uDD06";
    public static final String DWELL_RECEIVED_INTENT = "com.aftarobot.GEOFENCE_DWELL_INTENT";
    public static final String EXIT_RECEIVED_INTENT = "com.aftarobot.GEOFENCE_EXIT_INTENT";


    public GeofenceService() {
    }

    @Override
    protected void onHandleWork(Intent intent) {

        Log.i(IDENTIFIER, "onHandleWork: GeofenceService fired  \uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA");
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        geofencingEvent.getTriggeringLocation();
        if (geofencingEvent.hasError()) {
            Log.i(IDENTIFIER, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA geofenceTransition " +
                    "\uD83D\uDEBA  error code:" + geofencingEvent.getErrorCode());
            return;
        }

        int geofenceTransition = geofencingEvent.getGeofenceTransition();
        Log.i(IDENTIFIER, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA geofenceTransition fired: " + String.valueOf(geofenceTransition));

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_DWELL) {
            Log.i(IDENTIFIER, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                    "geofenceTransition \uD83D\uDEBA GEOFENCE_TRANSITION_DWELL: ");
            broadcast(geofencingEvent,  new Intent(DWELL_RECEIVED_INTENT));

        }
        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
            Log.i(IDENTIFIER, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                    "geofenceTransition \uD83D\uDEBA GEOFENCE_TRANSITION_EXIT: ");
            broadcast(geofencingEvent,  new Intent(EXIT_RECEIVED_INTENT));
        }
    }

    private void broadcast(GeofencingEvent geofencingEvent, Intent m) {
        Geofence s = geofencingEvent.getTriggeringGeofences().get(0);
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(getApplicationContext());
        m.putExtra("requestId", s.getRequestId());
        localBroadcastManager.sendBroadcast(m);

        Log.i(IDENTIFIER, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                "broadcast geofence transition \uD83D\uDEBA " + m.getDataString());
    }
}
