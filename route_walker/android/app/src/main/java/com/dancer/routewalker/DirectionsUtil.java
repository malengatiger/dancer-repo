package com.dancer.routewalker;

import android.os.AsyncTask;
import android.util.Log;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.maps.android.PolyUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DirectionsUtil {

    // origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
    private static final String URL = "https://maps.googleapis.com/maps/api/directions/json?";
    private static final String TAG = "\uD83C\uDF4E \uD83C\uDF4E Wild" + DirectionsUtil.class.getSimpleName() + " \uD83C\uDF4E ";
    public static final MediaType JSON
            = MediaType.get("application/json; charset=utf-8");
    private static final Gson G = new GsonBuilder().setPrettyPrinting().create();


    public static final String KA = "IzaSyACof";
    public static final String KB = "TXCmnlX9lU-Ufog";
    public static final String KC = "ErGIEE0odzZcUr";

    private static final OkHttpClient client = new OkHttpClient();

    private static LatListener listener;

    public static void getDirections(String origin, String destination, LatListener latListener) throws Exception {
        Log.d(TAG, mm + "getDirections: " + origin + " to " + destination + " "  + mm);
        listener = latListener;

        Bag bag = new Bag(origin,destination);
        Log.d(TAG, "getDirections: \uD83D\uDC99 \uD83D\uDC99 \uD83D\uDC99 " +
                "starting async task to run directions call ....");
        new MyTask().execute(bag);
    }

    private static class Bag {
        String origin, destination;

        public Bag(String origin, String destination) {
            this.origin = origin;
            this.destination = destination;
        }
    }

    static class MyTask extends AsyncTask<Bag, Void, List<LatLng>> {

        /**
         * Override this method to perform a computation on a background thread. The
         * specified parameters are the parameters passed to {@link #execute}
         * by the caller of this task.
         * <p>
         * This will normally run on a background thread. But to better
         * support testing frameworks, it is recommended that this also tolerates
         * direct execution on the foreground thread, as part of the {@link #execute} call.
         * <p>
         * This method can call {@link #publishProgress} to publish updates
         * on the UI thread.
         *
         * @param bags The parameters of the task.
         * @return A result, defined by the subclass of this task.
         * @see #onPreExecute()
         * @see #onPostExecute
         * @see #publishProgress
         */

        @Override
        protected List<LatLng> doInBackground(Bag... bags) {
            Bag mBag = bags[0];
            String url = URL + "origin="+mBag.origin+"&destination=" + mBag.destination + "&key=" + makeKey();
            Log.d(TAG, mm + "doInBackground: \uD83D\uDD06 url: " + url);

            List<LatLng> mList = null;
            try {
                String result = get(url);
                Log.d(TAG, mm + " ✅ ✅ doInBackground:  ✅ ✅ "
                        + " ✅ ✅ will process string returned into eventual latLongs ,,, \uD83D\uDD06");
                JsonObject convertedObject = G.fromJson(result, JsonObject.class);

                JsonArray arr = convertedObject.getAsJsonArray("routes");
                for (JsonElement jsonElement : arr) {
                    JsonObject cc = jsonElement.getAsJsonObject();
                    JsonObject bb = cc.getAsJsonObject("overview_polyline");
                    JsonPrimitive polyline = bb.getAsJsonPrimitive("points");
                    String enc = polyline.toString();

                    try {
                        mList = PolyUtil.decode(enc);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return null;
                    }
                    Log.d(TAG, "doInBackground: \uD83D\uDC4C\uD83D\uDC4C\uD83D\uDC4C LatLngs decoded : "
                            + mList.size()
                            + " points found on route \uD83D\uDC4C\uD83D\uDC4C\uD83D\uDC4C");

                }


            } catch (IOException  e) {
                e.printStackTrace();
                return null;
            }
            return mList;
        }
        @Override
        protected void onPostExecute(List<LatLng> list) {
            Log.d(TAG, mm + " ✅ ✅ onPostExecute: done finding latLngs or error ...");
            if (list == null) {
                listener.onError("We have shat the bed, Boss!");
            } else {
                listener.onDirections(list);
            }
        }

        public static String makeKey() {
            //return  "A" + KA + KC + KB;
            return  "AIzaSyA6Phm0FT7yT88XIFimCp3XhgGq0oLhXOQ";
        }
        public static String get(String url) throws IOException {
            Request request = new Request.Builder()
                    .url(url)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                return Objects.requireNonNull(response.body()).string();
            }
        }

        String post(String url, String json) throws IOException {
            RequestBody body = RequestBody.create(json, JSON);
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();
            try (Response response = client.newCall(request).execute()) {
                return Objects.requireNonNull(response.body()).string();
            }
        }

        public static List<LatLng> decode(String encodedPolyline) {
            List<LatLng> m =  PolyUtil.decode(encodedPolyline);
            Log.d(TAG, "decode: found " + m.size() + " LatLngs from polyline decoding");
            return m;
        }
    }
    public static final String mm = "\uD83C\uDF4E \uD83C\uDF4E \uD83C\uDF4E \uD83C\uDF4E ";
}

