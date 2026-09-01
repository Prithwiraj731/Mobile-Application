# Android Studio Setup & Build Guide — Pabir Paul's Tuition App

This guide walks you through installing Android Studio, opening the native Android project, running the app on an Android Emulator or physical device, and building the APK.

---

## 1. Install Android Studio

You already have the Android Studio installer downloaded in your **Downloads** folder:
`C:\Users\USER\Downloads\android-studio-quail3-patch1-windows.exe`

### Installation Steps:
1. Open File Explorer, navigate to `Downloads`, and double-click **`android-studio-quail3-patch1-windows.exe`**.
2. Click **Next** on the Welcome screen.
3. On the *Choose Components* screen, ensure both **Android Studio** and **Android Virtual Device (AVD)** are checked. Click **Next**.
4. Choose the default install location (`C:\Program Files\Android\Android Studio`) and click **Install**.
5. Once completed, check **Start Android Studio** and click **Finish**.
6. On the first launch, the Setup Wizard will prompt you to install the Android SDK (API 34/35/36) and Build-Tools. Choose **Standard** and let it finish downloading.

---

## 2. Project Organization & Architecture

Your project is structured as a dual Next.js + Native Android codebase:

```
Debraj_App/
├── android/                         # 👈 NATIVE ANDROID STUDIO PROJECT (Open this in Android Studio)
│   ├── app/
│   │   ├── build.gradle             # App-level build config (package: com.pabirpaul.tuition)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml  # Permissions, portrait lock, network security
│   │       ├── java/com/pabirpaul/tuition/
│   │       │   └── MainActivity.java # 🔒 Includes FLAG_SECURE (anti-screenshot protection)
│   │       └── res/                 # Icons, splash screens, network configs
│   ├── build.gradle                 # Top-level Gradle configuration
│   ├── gradlew.bat                  # Windows Gradle wrapper
│   └── settings.gradle
├── src/                             # Next.js frontend, API routes & components
│   ├── app/                         # App Router (Student portal, Admin, Auth, API)
│   ├── components/                  # UI, Secure Material Viewers, BottomNav
│   └── lib/                         # Supabase clients & security utilities
├── supabase/                        # Database migrations, RLS policies, seed scripts
├── public/                          # Static assets, PWA manifest, Capacitor entry
├── capacitor.config.ts              # Capacitor Android configuration
└── package.json                     # Scripts & dependencies
```

---

## 3. How to Open the Project in Android Studio

1. Open **Android Studio**.
2. On the Welcome screen, click **Open** (or go to **File ➔ Open...** if Android Studio is already open).
3. Browse to and select the **`android`** folder inside your project:
   ```
   C:\Users\USER\Desktop\Debraj_App\android
   ```
4. Click **OK**.
5. Android Studio will automatically import the project and start the Gradle sync. Wait for the sync to finish (indicated by `BUILD SUCCESSFUL` in the bottom status bar).

---

## 4. Running the App (Development Mode)

### Step A: Start the Next.js Dev Server
Open a terminal in your project root (`C:\Users\USER\Desktop\Debraj_App`) and run:
```bash
npm run dev:android
```
> This starts Next.js bound to `0.0.0.0:3000`, allowing the Android Emulator (via `http://10.0.2.2:3000`) and Wi-Fi devices to connect.

### Step B: Launch in Android Studio
1. In Android Studio, ensure the **`app`** configuration is selected in the top toolbar.
2. Select your target device:
   - **Android Emulator**: Click **Device Manager** (right sidebar or toolbar icon) ➔ **Create Device** (e.g. Pixel 8 / Pixel 7 with Android 14/15) ➔ Start the emulator.
   - **Physical Device**: Enable **Developer Options** and **USB Debugging** on your phone, then connect it via USB.
3. Click the green **Run ▶** button (or press `Shift + F10`).
4. The app will build, install, and open on the emulator or phone!

---

## 5. Native Security & Anti-Leak Protections

The Android project is hardened with native operating-system level protections:

1. **Anti-Screenshot & Anti-Screen-Recording (`FLAG_SECURE`)**:
   - Implemented in `MainActivity.java`:
     ```java
     getWindow().setFlags(
         WindowManager.LayoutParams.FLAG_SECURE,
         WindowManager.LayoutParams.FLAG_SECURE
     );
     ```
   - Prevents Android from capturing screenshots of study materials.
   - Prevents screen recorder apps from capturing tuition videos/notes (records black screen).
   - Clears preview snapshot in the Android recent apps switcher.

2. **Network Security Configuration**:
   - `network_security_config.xml` enables cleartext communication for local emulator testing (`10.0.2.2:3000`) while enforcing secure TLS/HTTPS for production.

3. **Orientation Lock**:
   - `AndroidManifest.xml` locks the application to portrait mode for an optimized mobile learning experience.

---

## 6. Building the APK (Installable File)

To generate an `.apk` file that you can install directly on any Android phone:

### In Android Studio:
1. In the top menu, go to **Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)**.
2. Wait for Gradle to build the project.
3. A notification will appear at the bottom right with a **locate** link.
4. The generated APK will be located at:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```
5. You can copy `app-debug.apk` to any Android phone and install it directly!

---

## 7. Useful NPM Scripts

Run these from `C:\Users\USER\Desktop\Debraj_App`:

| Command | Purpose |
| :--- | :--- |
| `npm run dev:android` | Starts Next.js dev server for Android Emulator connection (`0.0.0.0:3000`) |
| `npm run cap:sync` | Syncs web changes and plugins to the native Android project |
| `npm run cap:open` | Opens Android Studio directly with the `android/` project |
| `npm run cap:copy` | Copies web assets to Android assets folder without updating plugins |
| `npm run seed` | Seeds demo admin & student accounts into Supabase |
