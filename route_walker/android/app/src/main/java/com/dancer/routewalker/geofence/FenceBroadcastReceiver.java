package com.dancer.routewalker.geofence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import java.util.List;

//import com.google.android.gms.awareness.fence.FenceState;

public class FenceBroadcastReceiver extends BroadcastReceiver {
    public static final String TAG = "\uD83C\uDF4E \uD83C\uDF4E " + FenceBroadcastReceiver.class.getSimpleName();

    public static final String DWELL_RECEIVED_INTENT = "com.aftarobot.GEOFENCE_DWELL_INTENT";
    public static final String EXIT_RECEIVED_INTENT = "com.aftarobot.GEOFENCE_EXIT_INTENT";
    public static final String REQUEST_ID = "requestId";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "onReceive: FenceBroadcastReceiver fired  \uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA");
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        geofencingEvent.getTriggeringLocation();
        if (geofencingEvent.hasError()) {
            Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA geofenceTransition " +
                    "\uD83D\uDEBA  error code:" + geofencingEvent.getErrorCode());
            return;
        }

        int geofenceTransition = geofencingEvent.getGeofenceTransition();
        Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA geofenceTransition fired: " + geofenceTransition);
        Geofence geofence = geofencingEvent.getTriggeringGeofences().get(0);
        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_DWELL) {
            Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                    "geofenceTransition \uD83D\uDEBA GEOFENCE_TRANSITION_DWELL:  about to broadcast ...");

            Intent i = new Intent(DWELL_RECEIVED_INTENT);
            i.putExtra(REQUEST_ID, geofence.getRequestId());
            broadcast(geofencingEvent,  i, context);

        }
        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
            Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                    "geofenceTransition \uD83D\uDEBA GEOFENCE_TRANSITION_EXIT: about to broadcast ...");
            Intent i = new Intent(EXIT_RECEIVED_INTENT);
            i.putExtra(REQUEST_ID, geofence.getRequestId());
            broadcast(geofencingEvent,  i, context);
        }
    }

    private void broadcast(GeofencingEvent geofencingEvent, Intent intent, Context context) {
        Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA " +
                "broadcasting geofence transition \uD83D\uDEBA REQUEST_ID: " + intent.getStringExtra(REQUEST_ID));
        List<Geofence> triggeringFences = geofencingEvent.getTriggeringGeofences();
        Log.i(TAG, "\uD83D\uDEBA \uD83D\uDEBA \uD83D\uDEBA triggeringFences: " + triggeringFences.size() + " geoFence(s), sending LocalBroadcast ...");
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(context);
        intent.putExtra(REQUEST_ID, triggeringFences.get(0).getRequestId());

        localBroadcastManager.sendBroadcast(intent);


    }

}
