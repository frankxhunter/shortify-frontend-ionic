// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws',
  googleClientId: "435102139040-7g3peavcksvsajr0hpmtpuavbvqldh5q.apps.googleusercontent.com",
  googleAndroidClientId: "435102139040-3u1prgc0bc9u7g3iggqfg3nlfmu7mm3s.apps.googleusercontent.com",
  useMockAnalytics: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
