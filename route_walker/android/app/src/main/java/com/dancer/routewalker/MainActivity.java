package com.dancer.routewalker;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.dancer.routewalker.geofence.FenceBroadcastReceiver;
import com.dancer.routewalker.geofence.FenceManager;
import com.dancer.routewalker.geofence.Landmark;
import com.dancer.routewalker.geofence.Landmarks;
import com.dancer.routewalker.geofence.MessageBag;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainActivity extends FlutterActivity {
    private static final String CHANNEL = "aftarobot.com/routebuilder", TAG = "\uD83C\uDF40 RouteBuilderWildSide" ;
    private GeofencingClient geofencingClient;
    private FenceManager fenceManager;
    private static final String GEOFENCE_MESSAGE_CHANNEL = "aftarobot/geofences";
    private final Gson G = new GsonBuilder().setPrettyPrinting().create();

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);
        Log.d(TAG, "RouteBuilderWildSide: \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35" +
                " configureFlutterEngine: ");
        listenToGeofenceBroadcast();

        if (geofencingClient == null) {
            Log.d(TAG, "\uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 " +
                    "setting up GeofencingClient and FenceManager ....");
            geofencingClient = LocationServices.getGeofencingClient(this);
            fenceManager = new FenceManager(geofencingClient);
            Log.d(TAG, "\uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 " +
                    "configureFlutterEngine: geoFencing components set up!");

        }
        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL)
                .setMethodCallHandler(
                        (call, result) -> {
                            Log.d(TAG, "configureFlutterEngine: \uD83C\uDF40 \uD83C\uDF40  \uD83C\uDF40️\uD83C\uDF40️\uD83C\uDF40️  \uD83C\uDF40️\uD83C\uDF40️\uD83C\uDF40️" +
                                    " ..... MethodChannel woke up: " + CHANNEL);
                            Log.d(TAG, "configureFlutterEngine: arguments: " + call.arguments.toString());

                            List<Landmark> landmarkList = new ArrayList<>();
                            String json = call.arguments.toString();
                            Log.d(TAG, "configureFlutterEngine:  \uD83D\uDD06 \uD83D\uDD06 json: " + json);
                            Landmarks landmarks = G.fromJson(json, Landmarks.class);
                            Log.d(TAG, "configureFlutterEngine: \uD83D\uDD06 \uD83D\uDD06 landmarks received: " + landmarks.getLandmarks().size());
                            try {
                                fenceManager.buildLandmarkGeofences(landmarks.getLandmarks(), this, getApplicationContext());
                                result.success(" \uD83C\uDF40️\uD83C\uDF40️\uD83C\uDF40️ We good on the Wild Side!!");
                            } catch (Exception e) {
                                e.printStackTrace();
                               result.error("Fucked", "Geofence start failed", "wtf?");
                            }
                        }
                );
    }

    private void listenToGeofenceBroadcast() {
        Log.d(TAG, "\uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 " +
                "\uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 listenToGeofenceBroadcast .......... ");
        IntentFilter f1 = new IntentFilter(FenceBroadcastReceiver.DWELL_RECEIVED_INTENT);
        IntentFilter f2 = new IntentFilter(FenceBroadcastReceiver.EXIT_RECEIVED_INTENT);

        LocalBroadcastManager.getInstance(getApplicationContext()).registerReceiver(dwellBroadcastReceiver, f1);
        LocalBroadcastManager.getInstance(getApplicationContext()).registerReceiver(exitBroadcastReceiver, f2);
        Log.d(TAG, "\uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 \uD83D\uDD37 Geofencing Broadcast listeners registered and set up OK! \uD83D\uDD37");
    }
    BroadcastReceiver dwellBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "\uD83D\uDCCD \uD83D\uDCCD dwellBroadcastReceiver:  \uD83C\uDF4A \uD83C\uDF4A \uD83C\uDF4A " +
                    "onReceive DWELL.... requestId: " + intent.getStringExtra(FenceBroadcastReceiver.REQUEST_ID));
            MessageBag bag = new MessageBag(MessageBag.GEOFENCE_MESSAGE, intent.getStringExtra(FenceBroadcastReceiver.REQUEST_ID), null, MessageBag.DWELL);
            //todo - do something with this dwell .......
            Log.d(TAG, "dwellBroadcastReceiver: onReceive: DWELL " + G.toJson(bag));
        }
    };
    BroadcastReceiver exitBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "\uD83D\uDCCD \uD83D\uDCCD exitBroadcastReceiver  \uD83C\uDF4A \uD83C\uDF4A \uD83C\uDF4A " +
                    "onReceive EXIT.... requestId: " + intent.getStringExtra(FenceBroadcastReceiver.REQUEST_ID));

            MessageBag bag = new MessageBag(MessageBag.GEOFENCE_MESSAGE, intent.getStringExtra(FenceBroadcastReceiver.REQUEST_ID), null, MessageBag.EXIT);
            Log.d(TAG, "exitBroadcastReceiver: onReceive: EXIT " + G.toJson(bag));
        }
    };
}
