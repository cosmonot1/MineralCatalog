'use strict';

// Ensures that a catalog number counter exists. If one is created it starts at 0.

const pkg = require( '../package' );
const _Config = require( '../utils/config' )( pkg.name );
const Config = _Config.current;

// Set up config
_Config.load( require( '../config/app' ), {}, pkg.name );

const CatalogNumber = require( '../models/v0/catalog-number' );

console.log( '[!] Ensuring that catalog number counter exists.' );

CatalogNumber.get().then( success ).catch( err => {
  if ( err.code !== 404 ) {
    console.log( err );
    process.exit( 1 );
  }

  CatalogNumber.add().then( success ).catch( err => {
    console.log( err );
    process.exit( 1 );
  } );

} );

function success() {
  console.log( '[DONE!!!]' );
  process.exit( 0 );
}