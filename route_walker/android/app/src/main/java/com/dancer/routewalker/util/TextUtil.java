package com.dancer.routewalker.util;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;


public class TextUtil {

    public static final String TAG = TextUtil.class.getSimpleName();
    public static File textAsPNG(String text, float textSize, int textColor) {
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setTextSize(textSize);
        paint.setColor(textColor);
        paint.setTextAlign(Paint.Align.LEFT);
        float baseline = -paint.ascent(); // ascent() is negative
        int width = (int) (paint.measureText(text) + 0.5f); // round
        int height = (int) (baseline + paint.descent() + 0.5f);
        Bitmap image = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(image);
        canvas.drawText(text, 0, baseline, paint);

        File fn = null;
        try {  // Try to Save #1
            File dir = Environment.getExternalStorageDirectory();
            fn = new File(dir, "" + System.currentTimeMillis() +".png");
            FileOutputStream out = new FileOutputStream(fn);
            image.compress(Bitmap.CompressFormat.PNG, 90, out);
            out.flush();
            out.close();
            Log.d(TAG, "textAsBitmap: \uD83D\uDD06 \uD83D\uDD06 \uD83D\uDD06 PNG file created: " + text + " - " + fn.getAbsolutePath() + "  \uD83D\uDD06 length: " + fn.length());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return fn;
    }
}
