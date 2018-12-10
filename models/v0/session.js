'use strict';

const pkg = require( '../../package' );
const Config = require( '../../utils/config' )( pkg.name ).current;
const mongojs = require( '../../utils/mongojs' );
const uuid = require( 'uuid' );
const Utils = require( '../../utils' );
const validate = require( '../../utils/validate' ).callback;

const p = Utils.promisify;
const collection = mongojs( Config().services.db.mongodb.uri, [ 'sessions' ] ).sessions;

createIndexes();

module.exports = {
  add: add,
  createIndexes: createIndexes,
  get: get,
  remove: remove
};

function add( data, done ) {
  try {

    const session = {
      token: uuid.v4(),
      timestamps: {
        created: new Date()
      }
    };

    collection.insert( session, function ( err, result ) {

      if ( err ) {
        return done( err, null );
      }

      done( null, { session: { _id: result._id.toString() } } );

    } );

  }
  catch ( err ) {
    done(
      {
        code: 400,
        operation: 'session.add',
        type: 'validation',
        reason: err.message,
        err: new Error( 'Invalid input.' )
      },
      null
    );
  }
}

function createIndexes() {
  collection.createIndex( { 'timestamps.created': 1 }, { expireAfterSeconds: Config().session.lifetime } );
}

function get( data, done ) {

  validate( data, {
    _id: { type: String, format: 'mongodb.ObjectID', required: true }
  }, 'data', ( err, criteria ) => {
    if ( err ) {
      return done(
        {
          code: 400,
          operation: 'session.get',
          type: 'validation',
          reason: err.message,
          err: new Error( 'Invalid input.' )
        },
        null
      );
    }

    collection.findOne( criteria, {}, function ( err, session ) {

      if ( err ) {
        return done( err, null );
      }

      if ( session ) {
        return done( null, { session: session } );
      }

      done(
        {
          code: 404,
          operation: 'session.get',
          type: 'not-found',
          entity: 'session',
          reason: 'Session not found.',
          err: new Error( 'Not found.' )
        },
        null
      );

    } );
  } );
}

function remove( data, done ) {
  validate( data, {
    type: {
      _id: { type: String, format: 'mongodb.ObjectID', required: true }
    },
    required: true
  }, 'data', ( err, criteria ) => {
    if ( err ) {
      return done(
        {
          code: 400,
          operation: 'session.remove',
          type: 'validation',
          reason: err.message,
          err: new Error( 'Invalid input.' )
        },
        null
      );
    }

    collection.remove( criteria, function ( err, result ) {

      if ( err ) {
        return done( err, null );
      }

      if ( result.n ) {
        return done( null, null );
      }

      done(
        {
          code: 404,
          operation: 'session.remove',
          type: 'not-found',
          entity: 'session',
          reason: 'Session not found.',
          err: new Error( 'Not found.' )
        },
        null
      );

    } );

  } );
}
