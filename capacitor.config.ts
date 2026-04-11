import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.shortfy.starter',
  appName: 'Shortfy',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  server:{
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
