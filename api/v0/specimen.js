'use strict';

const flat = require( 'flat' );
const Specimen = require( '../../models/v0/specimen' );
const { callbackify: c, formatBody: fmtBody } = require( '../../utils/api' );
const moment = require( 'moment' );
const archiver = require( 'archiver' );
const json2csv = require( 'json-2-csv' ).json2csvPromisified;
const uuid = require( 'uuid' );
const { Storage } = require( '@google-cloud/storage' );

const storage = new Storage();
const bucket = storage.bucket( 'mineral-catalog-images' );

const EXPORT_PAGE_STEP = 100;

module.exports = {
  add: c( fmtBody( fmtReqRes( add ) ) ),
  download: downloadC( fmtBody( download ) ),
  get: c( fmtBody( fmtReqRes( Specimen.get ) ) ),
  list: c( fmtBody( fmtReqRes( Specimen.list ) ) ),
  remove: c( fmtBody( fmtReqRes( Specimen.remove ) ) ),
  update: c( fmtBody( fmtReqRes( update ) ) ),
  photo: {
    uploadUri: c( fmtBody( fmtReqRes( uploadUri ) ) )
    // downloadUri: c( fmtBody( fmtReqRes( downloadUri ) ) )
  },

};

function downloadC( fn ) {
  return ( req, res, next ) => fn( req, res ).catch( next );
}

async function add( data ) {

  data.specimen = flat.unflatten( data.specimen );
  data.specimen.species.additional = data.specimen.species.additional.split( ' ' );

  try {
    const date = moment( data.specimen.acquired.date );
    if ( !date.isValid() ) {
      throw new Error( 'Bad date' );
    }
    data.specimen.acquired.date = date.toISOString();
  } catch ( err ) {
    throw {
      code: 400,
      reason: 'Unable to format acquired date provided.',
      err: new Error( 'Unable to format acquired date provided.' )
    }
  }

  //TMP OP FOR TESTING BEFORE PHOTOS ARE IMPLEMENTED
  //TODO: REMOVE ONCE PHOTOS IMPLEMENTED
  data.specimen.photos = {
    main: '',
    all: [ '' ]
  };

  return await Specimen.add( data );
}

async function download( req, res ) {

  if ( !req.body.specimen ) {
    req.body.specimen = {};
  }

  res.status( 200 );
  res.attachment( `specimen_export_${Date.now()}.zip` );
  res.set( 'Content-Encoding', 'chunked' );

  const archive = archiver( 'zip', { store: true } );

  // Some error handling
  archive.on( 'error', err => {
    console.log( err );
    req.destroy();
  } );

  archive.on( 'end', () => res.end() );

  // Stream the archive to the client
  archive.pipe( res );

  __buildArchive( archive, req.body.specimen, req.body.type )
    .catch( err => {
      console.log( err );
      req.destroy();
    } )
    .finally( () => archive.finalize() );
}

async function update( data ) {

  data.set = flat.unflatten( data.set );
  data.set.species.additional = data.set.species.additional.split( ' ' );

  try {
    const date = moment( data.set.acquired.date );
    if ( !date.isValid() ) {
      throw new Error( 'Bad date' );
    }
    data.set.acquired.date = date.toISOString();
  } catch ( err ) {
    throw {
      code: 400,
      reason: 'Unable to format acquired date provided.',
      err: new Error( 'Unable to format acquired date provided.' )
    }
  }

  //TMP OP FOR TESTING BEFORE PHOTOS ARE IMPLEMENTED
  //TODO: REMOVE ONCE PHOTOS IMPLEMENTED
  data.set.photos = {
    main: '',
    all: [ '' ]
  };

  return await Specimen.update( data );
}

//TODO: handle different file extensions for images properly with content type
async function uploadUri( data ) {

  const filename = uuid.v4();
  const file = bucket.file( filename );
  const [ url ] = await file.getSignedUrl( {
    action: 'write',
    contentType: 'application/json',
    expires: moment().add( 30, 'd' ).toISOString()
  } );

  return { url, filename };

}

// async function downloadUri( data ) {
//
//   if ( !data.filename ) {
//     throw {
//       code: 400,
//       type: 'validation',
//       reason: 'Must provide GCS filename',
//       err: new Error( 'Must provide filename' )
//     };
//   }
//
//   const file = bucket.file( data.filename );
//   const [ url ] = await file.getSignedUrl( {
//     action: 'read',
//     expires: moment( 9999999999999 ).toISOString()
//   } );
//
//   return { url };
//
// }

function fmtReqRes( fn ) {
  return async req => {

    if ( !req.body.specimen ) {
      req.body.specimen = {}
    }

    if ( req.params._id ) {
      req.body.specimen._id = req.params._id;
    }

    return await fn( req.body );

  };
}

async function __buildArchive( archive, query, type ) {
  for ( let offset = 0; ; offset += EXPORT_PAGE_STEP ) {

    const { specimens } = await Specimen.list(
      {
        specimen: query,
        offset: offset,
        limit: EXPORT_PAGE_STEP
      }
    );

    if ( !specimens.length ) {
      return;
    }

    const files = await __buildFiles( specimens, type );

    for ( const i in specimens ) {

      const timestamp = new Date( specimens[ i ].timestamps.created ).getTime();
      const catalog_number = specimens[ i ].catalog_number;

      await archive.append(
        files[ i ],
        {
          name: `${catalog_number}.${type}`,
          date: timestamp
        }
      );

    }

  }
}

async function __buildFiles( specimens, type ) {

  if ( type === 'json' ) {
    return __buildJSON( specimens );
  }
  else if ( type === 'csv' ) {
    return __buildCSV( specimens );
  }

  throw new Error( 'Invalid export type.' );

}

function __buildJSON( specimens ) {
  return specimens.map( a => JSON.stringify( a ) );
}

function __buildCSV( specimens ) {
  return Promise.all(
    specimens.map( a => json2csv( flat.flatten( a ), { checkSchemaDifferences: false } ) )
  );
}
