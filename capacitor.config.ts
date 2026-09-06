import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Pabir Paul's Tuition Android App
 *
 * For Local Development on Android Studio Emulator:
 * - Start Next.js dev server: npm run dev:android (runs on http://0.0.0.0:3000)
 * - The Android Emulator accesses host localhost via http://10.0.2.2:3000
 *
 * For Physical Device Testing (USB / Wi-Fi):
 * - Change url to your PC's local IP (e.g., http://192.168.1.5:3000)
 *
 * For Production Release:
 * - Set url to your deployed production domain (e.g., https://your-domain.com)
 */
const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.pabirpaul.tuition',
  appName: "Pabir Paul's Tuition",
  webDir: 'public',
  server: {
    // Uses live production Render URL by default, or local dev if overridden
    url: process.env.CAP_SERVER_URL || (isDev ? 'http://10.0.2.2:3000' : 'https://pabir-pauls-tution.onrender.com'),
    cleartext: isDev,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: isDev,
    captureInput: true,
    webContentsDebuggingEnabled: isDev
  }
};

export default config;
