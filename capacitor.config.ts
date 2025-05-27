
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.da985f72eebe4698b5612ecdb36fa97a',
  appName: 'docu-sign-flow-mobile',
  webDir: 'dist',
  server: {
    url: "https://da985f72-eebe-4698-b561-2ecdb36fa97a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
