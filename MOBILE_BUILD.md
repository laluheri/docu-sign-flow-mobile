
# Mobile App Build Instructions

This guide will help you build and install the Android APK for the docu-sign-flow-mobile application.

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **Android Studio** with Android SDK
3. **Java Development Kit (JDK)** version 11 or higher
4. **Git** for version control

## Step-by-Step Build Process

### 1. Export and Clone the Project

1. Click the "Export to Github" button in Lovable to transfer the project to your GitHub repository
2. Clone the project to your local machine:
   ```bash
   git clone [your-github-repo-url]
   cd docu-sign-flow-mobile
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Android Platform

```bash
npx cap add android
```

### 4. Build the Web Application

```bash
npm run build
```

### 5. Sync with Capacitor

```bash
npx cap sync android
```

### 6. Open in Android Studio

```bash
npx cap open android
```

This will open the project in Android Studio.

### 7. Build APK in Android Studio

1. In Android Studio, wait for the project to fully load and sync
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build process to complete
4. The APK will be generated in: `android/app/build/outputs/apk/debug/app-debug.apk`

### 8. Install on Android Device

#### Option A: Direct Installation
1. Enable "Developer Options" and "USB Debugging" on your Android device
2. Connect your device via USB
3. In Android Studio, click the "Run" button or use `npx cap run android`

#### Option B: Manual APK Installation
1. Transfer the `app-debug.apk` file to your Android device
2. Enable "Install from Unknown Sources" in your device settings
3. Open the APK file on your device to install

## Development Workflow

After making changes to your code:

1. Build the web app: `npm run build`
2. Sync changes: `npx cap sync android`
3. Run on device: `npx cap run android`

## Troubleshooting

- **Build fails**: Ensure all dependencies are installed and Android SDK is properly configured
- **App won't install**: Check that "Unknown Sources" is enabled on your device
- **White screen on launch**: Verify that the build process completed successfully

## Production Build

For a production APK:

1. In Android Studio, go to **Build** → **Generate Signed Bundle / APK**
2. Follow the prompts to create a keystore and sign your APK
3. Choose "APK" and select "release" build variant

## Notes

- The app is configured to work in development mode with hot-reload from the Lovable sandbox
- For production deployment, you may want to remove the server configuration from `capacitor.config.ts`
- Always test thoroughly on actual devices before distributing
