// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBase: "https://git.heroku.com/marvel-card-game.git",
  firebase: {
    apiKey: "AIzaSyBhYMS0ndr4YHnkhZ9RLcxHO_d4oO6XlWA",
  authDomain: "cardgame-92222.firebaseapp.com",
  projectId: "cardgame-92222",
  storageBucket: "cardgame-92222.appspot.com",
  messagingSenderId: "519958977214",
  appId: "1:519958977214:web:3c18fe5e3d26060ecedcef"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
