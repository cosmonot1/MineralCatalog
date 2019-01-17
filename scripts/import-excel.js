'use strict';

const pkg = require( '../package.json' );
const _Config = require( '../utils/config' )( pkg.name );

_Config.load( require( '../config/app.json' ), {}, pkg.name );

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

main( process.argv[ 2 ] )
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
  const sheet_name_list = workbook.SheetNames;
  console.log( XLSX.utils.sheet_to_json( workbook.Sheets[ sheet_name_list[ 0 ] ] ) );

}
