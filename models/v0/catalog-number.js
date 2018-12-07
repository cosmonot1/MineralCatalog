'use strict';

const pkg = require( '../../package' );
const Config = require( '../../utils/config' )( pkg.name ).current;
const mongojs = require( '../../utils/mongojs' );
const uuid = require( 'uuid' );
const Utils = require( '../../utils' );

const p = Utils.promisify;
const collection = mongojs( Config().services.db.mongodb.uri, [ 'catalog_number' ] ).catalog_number;

module.exports = {
  add,
  get,
  getAndInc
};

async function add() {
  const result = await p( collection.insert )( {
    _id: uuid.v4(),
    number: 0
  } ).catch( err => {

    // Check for duplicate key error
    if ( err.message && err.message.startsWith( 'E11000' ) ) {
      throw {
        code: 409,
        operation: 'catalog_number.add',
        type: 'conflict',
        reason: 'Catalog Number with that _id already exists.',
        err: new Error( 'Conflict.' )
      };
    }

    throw err;

  } );

  return { catalog_number: result };
}

async function get() {
  const result = await p( collection.findOne.bind( collection ) )( {} );

  if ( !result ) {
    throw {
      code: 404,
      operation: 'catalog_number.get',
      type: 'not-found',
      entity: 'catalog_number',
      reason: 'Catalog number not found.',
      err: new Error( 'Not found.' )
    };
  }

  return { catalog_number: result };
}

// Get the catalog counter from the db and then increment it's value by one. Return the old value.
async function getAndInc() {
  const result = await p( collection.findAndModify )( {
    query: {},
    update: {
      $inc: { number: 1 },
      $currentDate: {
        'timestamps.modified': true
      }
    }
  } );

  if ( !result ) {
    throw {
      code: 404,
      operation: 'catalog_number.get',
      type: 'not-found',
      entity: 'catalog_number',
      reason: 'Catalog number not found.',
      err: new Error( 'Not found.' )
    };
  }

  return { catalog_number: result };

}
