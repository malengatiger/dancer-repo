package com.dancer.routewalker;


import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.UiThread;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainActivity extends FlutterActivity {
    private static final String CHANNEL = "aftarobot.com/routebuilder", TAG = "\uD83C\uDF40 RouteBuilderWildSide";
    private final Gson G = new GsonBuilder().setPrettyPrinting().create();

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);
        Log.d(TAG, "\uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35 " +
                "\uD83D\uDD35 \uD83D\uDD35 \uD83D\uDD35" +
                " configureFlutterEngine: ");

        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL)
                .setMethodCallHandler(
                        (call, result) -> {
                            Log.d(TAG, "configureFlutterEngine: \uD83C\uDF40 \uD83C\uDF40" +
                                    "  \uD83C\uDF40️\uD83C\uDF40️\uD83C\uDF40️  \uD83C\uDF40️\uD83C\uDF40️\uD83C\uDF40️" +
                                    " ..... MethodChannel woke up: " + CHANNEL);
                            Log.d(TAG, "configureFlutterEngine: arguments: "
                                    + call.arguments.toString());
                            String origin = call.argument("origin");
                            String destination = call.argument("destination");
                            try {
                                DirectionsUtil.getDirections(origin, destination, new LatListener() {
                                    @Override
                                    public void onDirections(List<LatLng> list) {
                                        String json = G.toJson(list);
                                        result.success(json);
                                    }

                                    @UiThread
                                    @Override
                                    public void onString(String json) {
                                        result.success(json);
                                    }

                                    @Override
                                    public void onError(String message) {
                                        result.error("101", message, "");
                                    }
                                });


                            } catch (Exception e) {
                                e.printStackTrace();
                                result.error("101", "We fucked Up!", null);
                            }

                        }
                );
    }


}
