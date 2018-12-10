'use strict';

const Specimen = require( '../../models/v0/specimen' );

module.exports = {
  add: fmtReqRes( Specimen.add ),
  get: fmtReqRes( Specimen.get ),
  list: fmtReqRes( Specimen.list ),
  remove: fmtReqRes( Specimen.remove ),
  update: fmtReqRes( Specimen.update )

};

function fmtReqRes( fn ) {
  return async req => {

    req.body.specimen._id = req.params._id;

    return await fn( req.body );

  };
}
