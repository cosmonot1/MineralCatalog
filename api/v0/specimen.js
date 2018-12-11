'use strict';

const flat = require( 'flat' );
const Specimen = require( '../../models/v0/specimen' );
const { callbackify: c, formatBody: fmtBody } = require( '../../utils/api' );

module.exports = {
  add: c( fmtBody( fmtReqRes( add ) ) ),
  get: c( fmtBody( fmtReqRes( Specimen.get ) ) ),
  list: c( fmtBody( fmtReqRes( Specimen.list ) ) ),
  remove: c( fmtBody( fmtReqRes( Specimen.remove ) ) ),
  update: c( fmtBody( fmtReqRes( Specimen.update ) ) )

};

async function add( data ) {
  data.specimen = flat.unflatten( data.specimen );

  data.specimen.species.additional = data.specimen.species.additional.split( ' ' );

  //TMP OP FOR TESTING BEFORE PHOTOS ARE IMPLEMENTED
  //TODO: REMOVE ONCE PHOTOS IMPLEMENTED
  data.specimen.photos = {
    main: '',
    all: [ '' ]
  };

  return await Specimen.add( data );
}

function fmtReqRes( fn ) {
  return async req => {

    req.body.specimen._id = req.params._id;

    return await fn( req.body );

  };
}
