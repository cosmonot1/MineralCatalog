'use strict';

const pkg = require( '../../package' );
const _Config=require('../../utils/config')( pkg.name ).load(require('../../config/app'),{});
const Config = require( '../../utils/config' )( pkg.name ).current;
const mongojs = require( '../../utils/mongojs' );

const collection = mongojs( Config().services.db.mongodb.uri, [ 'specimens' ] ).specimens;

const newFormat = {
  "photos": {
    "main": "",
    "all": []
  },
  "physical_dimensions": {
    "weight": null,
    "length": null,
    "width": null,
    "height": null,
    "main_crystal": null
  },
  "species": {
    "main": "",
    "additional": []
  },
  "discovery_location": {
    "stope": "",
    "level": "",
    "mine": "",
    "district": "",
    "state": "",
    "country": ""
  },
  "analysis": {
    "analyzed": false,
    "by": "",
    "method": ""
  },
  "acquired": {
    "date": null,
    "paid": null,
    "from": "",
    "where": ""
  },
  "states": {
    "old_label": false,
    "repair": false,
    "story": false,
    "figured": false
  },
  "storage_location": {
    "exhibit": false,
    "inside": false,
    "outside": false,
    "loan": false,
    "details": ""
  },
  "geology": {
    "metamorphic": false,
    "pegmatite": false,
    "porphyry": false,
    "crd_skarn": false,
    "epithermal_vein": false,
    "volcanic_related": false,
    "exhalite": false,
    "mvt": false,
    "evaporite": false,
    "other": ""
  },
  "exhibit_history": [],
  "features": {
    "twinned": false,
    "pseudomorph": false,
    "inclusions": false,
    "photosensitive": false
  },
  "fluorescence": {
    "sw": false,
    "sw_details": "",
    "lw": false,
    "lw_details": ""
  },
  "quality": {
    "exceptional": false,
    "exhibit": false,
    "locality": false,
    "study": false
  },
  "locality": {
    "type_locality": false,
    "self_collected": false,
    "when": null
  },
  "photographed": {
    "photographed": false,
    "by": "",
    "photo_file_number": "",
    "files": []
  },
  "provenance": {
    "old_labels": false,
    "prior_labels": false,
    "former_owners": [],
    "prior_catalog_number": null,
    "label": false,
    "label_files": [],
    "miguel_romero": false,
    "miguel_romero_number": null
  },
  "comments": "",
  "story": "",
  "figured": "",
  "repair_history": "",
  "analysis_history": "",
  "specimen_location": "",
  "documents": []
};

console.log( '[!] Updating specimen objects.' );

collection.find( {}, function ( err, result ) {

  if ( err ) {
    console.error( err );
    process.exit( 1 );
  }

  const next = function ( files, i, done ) {
    if ( i >= files.length ) {
      done();
    }

    if ( i % 100 === 0 ) {
      console.log( '\t[!] ' + i + ' of ' + files.length + '.' );
    }

    update( files[ i ], function ( err ) {
      if ( err ) {
        return done( err );
      }

      next( files, ++i, done );

    } );

  };

  next( result, 0, function ( err ) {
    if ( err ) {
      console.error( err );
      process.exit( 1 );
    }

    console.log( '[!] Updated ' + result.length + ' files.' );
    console.log( '[ALL DONE!!!]' );

    process.exit( 0 );

  } );

} );

function update( specimen, done ) {

  collection.update( { _id: specimen._id }, Object.assign( {}, newFormat, specimen ), {}, function ( err ) {
    return done( err );
  } );

}
