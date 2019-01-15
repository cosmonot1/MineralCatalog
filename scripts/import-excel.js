'use strict';

const pkg = require( '../package' );
const _Config = require( '../utils/config' )( pkg.name );

_Config.load( '../config/app.json' );

const Config = _Config.current;
const mongojs = require( '../utils/mongojs' );
const Utils = require( '../utils' );
const XLSX = require( 'xlsx' );
const fs = require( 'fs' );

const p = Utils.promisify;
const collection = mongojs( Config().services.db.mongodb.uri, [ 'specimens' ] ).specimens;

/**
 * Script for reading minerals from an excel workbook
 * Usage: npm run import-excel path/to/file.xlsx
 */

console.log( proces.argv );

main( process.argv[ 3 ] )
  .then( () => {
    console.log( '[DONE!!!]' );
    process.exit();
  } )
  .catch( ( err ) => {
    console.error( err );
    process.exit( 1 );
  } );

async function main ( file_path ) {

  // Make sure work book is accessible and then read the file
  await p( fs.access )( file_path, fs.constants.R_OK );
  const workbook = XLSX.readFile( file_path );

  // Parse workbook
  console.log( workbook.utils.sheet_to_json );

}
