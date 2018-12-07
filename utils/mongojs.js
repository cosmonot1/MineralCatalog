'use strict';

var mongojs = require( 'mongojs' );

// TODO: Reduce into auto generated list if possible
var fns = [
  'find',
  'findOne',
  'update',
  'insert',
  'findAndModify',
  'count',
  'sort',
  'skip',
  'limit',
  'aggregate',
  'initializeUnorderedBulkOp',
  'remove',
  'createIndex'
];

module.exports = function ( uri, collections ) {

  var db = mongojs( uri, collections );

  for ( var i in collections ) {
    fns.forEach( function ( item ) {
      db[ collections[ i ] ][ item ] = wrapper( db[ collections[ i ] ][ item ], db[ collections[ i ] ], item );
    } );
  }

  db.dropDatabase = wrapper( db.dropDatabase, db, 'dropDatabase' );

  return db;

};

module.exports.ObjectID = mongojs.ObjectID;
module.exports.ObjectId = mongojs.ObjectId;

function wrapper( fn, collection, op ) {

  return function () {

    var Utils = require( '../utils' );

    var cb = arguments[ arguments.length - 1 ];

    if ( Utils.isFunction( cb ) ) {
      arguments[ arguments.length - 1 ] = Utils.trace( function () {

        if ( arguments[ 0 ] ) {
          arguments[ 0 ].code = 500;
          arguments[ 0 ].operation = 'db.' + op;
          arguments[ 0 ].type = 'database';
        }

        cb.apply( null, arguments );

      } );
    }

    return fn.apply( collection, arguments );

  };

}
