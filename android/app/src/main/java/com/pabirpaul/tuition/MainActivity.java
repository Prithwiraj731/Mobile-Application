package com.pabirpaul.tuition;

import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {

    public class AndroidBridge {
        private final Context context;

        public AndroidBridge(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public boolean saveFile(String base64Data, String filename, String mimeType) {
            try {
                String cleanBase64 = base64Data;
                if (cleanBase64.contains(",")) {
                    cleanBase64 = cleanBase64.substring(cleanBase64.indexOf(",") + 1);
                }
                final byte[] fileBytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                String resolvedMime = mimeType;
                if (resolvedMime == null || resolvedMime.isEmpty() || resolvedMime.equals("application/octet-stream")) {
                    if (filename.endsWith(".pdf")) resolvedMime = "application/pdf";
                    else if (filename.endsWith(".mp3")) resolvedMime = "audio/mpeg";
                    else resolvedMime = "text/plain";
                }
                final String finalMime = resolvedMime;
                final String finalFilename = filename;

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, finalFilename);
                    values.put(MediaStore.Downloads.MIME_TYPE, finalMime);
                    values.put(MediaStore.Downloads.IS_PENDING, 1);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                    Uri collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                    Uri itemUri = context.getContentResolver().insert(collection, values);

                    if (itemUri != null) {
                        try (OutputStream out = context.getContentResolver().openOutputStream(itemUri)) {
                            if (out != null) {
                                out.write(fileBytes);
                                out.flush();
                            }
                        }
                        values.clear();
                        values.put(MediaStore.Downloads.IS_PENDING, 0);
                        context.getContentResolver().update(itemUri, values, null, null);
                    }
                } else {
                    File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    if (!downloadsDir.exists()) downloadsDir.mkdirs();
                    File file = new File(downloadsDir, finalFilename);
                    try (FileOutputStream fos = new FileOutputStream(file)) {
                        fos.write(fileBytes);
                        fos.flush();
                    }
                    MediaScannerConnection.scanFile(context, new String[]{file.getAbsolutePath()}, new String[]{finalMime}, null);
                }

                new Handler(Looper.getMainLooper()).post(() -> {
                    Toast.makeText(context, "Saved " + finalFilename + " to Downloads", Toast.LENGTH_LONG).show();
                });

                return true;
            } catch (Exception e) {
                Log.e("TuitionBridge", "Error saving file: " + e.getMessage(), e);
                new Handler(Looper.getMainLooper()).post(() -> {
                    Toast.makeText(context, "Download failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
                return false;
            }
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Native Anti-Leak Protection: Block screenshots, screen recording, and app switcher caching
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );

        // Native Status Bar Insets: Keep app below notification bar with sleek dark status bar
        android.view.Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.parseColor("#09090b"));

        android.view.View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, insets) -> {
                androidx.core.graphics.Insets statusBarInsets = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.statusBars());
                v.setPadding(0, statusBarInsets.top, 0, 0);
                return insets;
            });
        }

        // Native Download Manager integration for Android WebView
        try {
            WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                webView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");

                webView.setDownloadListener(new DownloadListener() {
                    @Override
                    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                        try {
                            if (url.startsWith("blob:") || url.startsWith("data:")) {
                                return;
                            }
                            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                            if (mimetype != null && !mimetype.isEmpty()) {
                                request.setMimeType(mimetype);
                            }
                            
                            String cookies = CookieManager.getInstance().getCookie(url);
                            if (cookies != null) {
                                request.addRequestHeader("cookie", cookies);
                            }
                            if (userAgent != null) {
                                request.addRequestHeader("User-Agent", userAgent);
                            }
                            
                            String filename = URLUtil.guessFileName(url, contentDisposition, mimetype);
                            request.setDescription("Downloading study material...");
                            request.setTitle(filename);
                            request.allowScanningByMediaScanner();
                            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
                            
                            DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                            if (dm != null) {
                                dm.enqueue(request);
                                Toast.makeText(getApplicationContext(), "Downloading " + filename + "...", Toast.LENGTH_SHORT).show();
                            }
                        } catch (Exception e) {
                            Log.e("TuitionDownload", "Download listener error: " + e.getMessage(), e);
                        }
                    }
                });
            }
        } catch (Exception e) {
            Log.e("MainActivity", "Setup error: " + e.getMessage(), e);
        }
    }
}
