'use strict';

const pkg = require( '../../package' );
const Config = require( '../../utils/config' )( pkg.name ).current;
const flat = require( 'flat' );
const Specimen = require( '../../models/v0/specimen' );
const { callbackify: c, formatBody: fmtBody } = require( '../../utils/api' );
const moment = require( 'moment' );
const archiver = require( 'archiver' );
const json2csv = require( 'json-2-csv' ).json2csvPromisified;
const uuid = require( 'uuid' );
const { Storage } = require( '@google-cloud/storage' );

const storage = new Storage();
const image_bucket = storage.bucket( 'mineral-catalog-images' );
const analysis_bucket = storage.bucket( 'mineral-catalog-analysis-documents' );
const label_bucket = storage.bucket( 'mineral-catalog-labels' );
const professional_photo_bucket = storage.bucket( 'mineral-catalog-professional-photos' );

const EXPORT_PAGE_STEP = 100;

module.exports = {
  add: c( fmtBody( fmtReqRes( add ) ) ),
  download: downloadC( fmtBody( download ) ),
  get: c( fmtBody( fmtReqRes( Specimen.get ) ) ),
  list: c( fmtBody( fmtReqRes( Specimen.list ) ) ),
  remove: c( fmtBody( fmtReqRes( Specimen.remove ) ) ),
  update: c( fmtBody( fmtReqRes( update ) ) ),
  upload: c( fmtBody( fmtReqRes( uploadUri ) ) )
};

function downloadC( fn ) {
  return ( req, res, next ) => fn( req, res ).catch( next );
}

async function add( data ) {

  data.specimen = flat.unflatten( data.specimen );

  try {
    //todo: dates should be checked if exist. if date exists validate it, otherwise save as a null date
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

  try {
    //todo: dates should be checked if exist. if date exists validate it, otherwise save as a null date
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

  return await Specimen.update( data );
}

async function uploadUri( data ) {

  let bucket;
  if ( data.type === 'photo' ) {
    bucket = image_bucket;
  } else if ( data.type === 'analysis' ) {
    bucket = analysis_bucket;
  } else if ( data.type === 'label' ) {
    bucket = label_bucket;
  } else if ( data.type === 'professional_photo' ) {
    bucket = professional_photo_bucket;
  } else {
    throw {
      code: 400,
      type: 'validation',
      field: 'req.params.type',
      reason: 'Invalid upload URI type',
      err: new Error( 'Validation error.' )
    }
  }

  const type = data[ 'content-type' ] || 'application/json';

  const filename = uuid.v4();
  const file = bucket.file( filename );
  const [ url ] = await file.getSignedUrl( {
    action: 'write',
    contentType: type,
    expires: moment().add( 30, 'd' ).toISOString()
  } );

  return { url, filename };

}

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

    specimens.forEach( s => {
      if ( s.photos.main ) {
        s.photos.main = Config().services.gcloud.imageBaseLink + s.photos.main;
      }
      s.photos.all = s.photos.all.map( photo => Config().services.gcloud.imageBaseLink + photo );
      s.documents = s.documents.map( doc => Config().services.gcloud.analysisDocBaseLink + doc );
      s.provenance.label_files = s.documents.map( doc => Config().services.gcloud.labelBaseLink + doc );
      s.photographed.files = s.documents.map( doc => Config().services.gcloud.professionalPhotoBaseLink + doc );
    } );

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
