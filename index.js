'use strict';

const pkg = require( 'pkg' );
const _Config = require( './utils/config' )( pkg.name );
const fs = require( 'fs' );
const path = require( 'path' );
const objectPath = require( 'object-path' );
const express = require( 'express' );
const exitHook = require( 'async-exit-hook' );

if ( require.main === module ) {
  Server().start( err => {
    if ( err ) {
      console.log( err );
      process.kill( process.pid );
    }
  } );
}

module.exports = Server;

function Server( config ) {
  if ( !this || !this.constructor !== Server ) {
    return new Server( config );
  }

  let server;
  let running = false;

  exitHook( done => this.stop( done ) );

  this.start = done => {

    done = done || ( () => 0 );

    if ( running ) {
      return done( new Error( 'Already running.' ) );
    }

    running = true;

    // Set up config
    config = config || {};
    objectPath.set( config, 'server.version', pkg.version );
    _Config.load( require( './config/app' ), config, pkg.name );

    process.on( 'unhandledRejection', console.log );

    // Initialize http(s) server
    // Currently only doing basic HTTP server. Will be expanded to HTTPS server if needed
    const app = express();
    // if ( Config().server.protocol === 'https' ) {
    //
    //   Log.log( '[!] Initializing HTTPS server.' );
    //
    //   server = require( 'https' ).createServer(
    //     {
    //       key: fs.readFileSync( Config().server.https.key ),
    //       cert: fs.readFileSync( Config().server.https.crt ),
    //       ca: fs.readFileSync( Config().server.https.ca )
    //     },
    //     app
    //   );
    //
    // }
    // else {
    Log.log( '[!] Initializing HTTP server.' );
    server = require( 'http' ).createServer( app );
    // }

    // Configure Express
    Log.log( '[!] Configuring HTTP server.' );

    app.disable( 'x-powered-by' );
    app.set( 'env', 'production' );

    if ( Config().server.http.redirect ) {
      app.use( http_redirect.express );
    }

    app.use( require( './middleware/health-check' ) );
    app.use( require( './middleware/version' ).express() );
    app.use( require( 'compression' )( { level: 9, memLevel: 9 } ) );
    app.use( require( './middleware/cache' ).disallow );

    //TODO: UPDATE THESE DIRECTORIES
    const static1 = path.resolve( __dirname, Config().build ? 'build' : '', 'views', 'src' );
    const static2 = path.resolve( __dirname, 'views', 'static' );

    // Static
    app.use( express.static( static1, { index: false } ) );
    app.use( express.static( static2, { index: false } ) );

    // Headers
    app.use( require( './middleware/cookie-parser' ).express() );
    app.use( require( 'body-parser' ).json() );

    //TODO: figure out how to do session and security stuff
    // app.use( require( './middleware/session' ).express() );

    // Set up route handlers
    Log.log( '[!] Generating route handlers.' );
    app.use( '/', require( './routes' )() );

    // Start the server
    Log.log( '[!] Starting web server.' );

    const port = Config().server[ Config().server.protocol ].port;

    server.listen( port, err => {

      if ( err ) {
        return done( err );
      }

      Log.log( `[!] Web server listening on port ${port}.` );

      // Start services
      Log.log( '[!] Starting services.' );

      // Check if we need to start a redirect server for HTTP to HTTPS
      if ( Config().server.protocol === 'https' && Config().server.http.redirect ) {
        return http_redirect.server( Config().server.http.port, done );
      }

      done( null );

    } );

  };

  this.stop = done => {

    if ( !running ) {
      return done( new Error( 'Not running.' ) );
    }

    console.log( '[!] Stopping server.' );

    running = false;

    server.close();

    done();

  };

}