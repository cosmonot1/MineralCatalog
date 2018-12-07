'use strict';

const pkg = require( '../package' );
const _version = pkg.version.split( '.' );

const VERSION = {
  full: pkg.version,
  major: _version[ 0 ],
  minor: _version[ 1 ],
  patch: _version[ 2 ]
};

module.exports = {};

// Import all api versions
for ( let i = 0; i <= VERSION.major; ++i ) {
  try {
    module.exports[ `v${i}` ] = require( `./v${i}` );
  }
  catch ( err ) {
    console.log( err );
  }
}
