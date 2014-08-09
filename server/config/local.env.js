'use strict';

// Environment variables that grunt will set when the server starts locally. Use for your api keys, secrets, etc.
// You will need to set these on the server you deploy to.
//
// This file should not be tracked by git.

module.exports = {
  DOMAIN: 'http://10.1.1.4:9000',
  SESSION_SECRET: "invoicer-secret",

  GOOGLE_ID: '167450636637-rc752q1ps1uemgt68ig8he13epfbc9lc.apps.googleusercontent.com',
  GOOGLE_SECRET: 'ctkDMpTwXncbP_zcRDSWpUor',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
