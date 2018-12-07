'use strict';

const Utils = require( '@simple-emotion/utils' );
const { promisify: p } = require( 'util' );
const equal = require( 'deep-equal' );
const moment = require( 'moment' );
const mongodb = require( 'mongodb' );
const flat = require( 'flat' );

const RECURSIVE_DEPTH = 100;

module.exports = p( validate );
module.exports.callback = validate;

const formats = {
  'date': formatDate,
  'moment': formatMoment,
  'iso-date': formatISODate,
  'mongodb.ObjectID': formatMongoDBObjectID,
  'trim': trimString,
  'phone': formatPhone
};

function validate( input, spec, name, _done ) {

  const stack = new Error().stack;

  if ( !_done ) {
    _done = name;
    name = '';
  }

  let done = function ( err, struct ) {

    if ( err ) {

      err.code = 400;
      err.operation = 'validate-input';
      err.type = err.type || 'validation';

      if ( err.err instanceof Error ) {
        err.err.stack = stack;
      }

    }

    _done( err, struct );

  };

  // Spec must be an object
  if ( Object.prototype.toString.call( spec ) !== '[object Object]' ) {
    return done(
      {
        type: 'specification',
        reason: 'Specification must be a truthy object.',
        err: new Error( 'Invalid specification.' )
      },
      null
    );
  }

  // Ensure required and default not co-specified
  if ( spec.required && 'default' in spec ) {
    return done(
      {
        field: name,
        reason: `Missing required field ${name}.`,
        err: new Error( 'Invalid input.' )
      },
      null
    );
  }

  if ( 'flatten' in spec && ( [ 'boolean', 'number' ].indexOf( typeof spec.flatten ) === -1 || spec.flatten < 0 ) ) {
    return done(
      {
        field: name,
        type: 'specification',
        reason: `Flatten must be a boolean or number >= 0.`,
        err: new Error( 'Invalid input.' )
      },
      null
    );
  }

  // Check for undefined requirement
  if ( input === undefined ) {

    if ( spec.required ) {
      return done(
        {
          field: name,
          reason: `Missing required field ${name}.`,
          err: new Error( 'Invalid input.' )
        },
        null
      );
    }

    if ( !( 'default' in spec ) ) {
      return done( null, undefined );
    }

    input = getDefault( spec );

  }

  // Check if we need to validate value
  if ( 'value' in spec ) {
    return validateValue( input, spec, name, ( err, value ) => {
      if ( err ) {
        return done( err );
      }
      formatValue( value, spec, name, done )
    } );
  }

  // Check if we need to validate type
  if ( 'type' in spec ) {
    return validateType( input, spec, name, ( err, value ) => {
      if ( err ) {
        return done( err );
      }
      formatValue( value, spec, name, done )
    } );
  }

  // Format value
  formatValue( input, spec, name, done );

}

function getDefault( spec ) {
  return typeof spec.default === 'function' ? spec.default() : spec.default;
}

function validateValue( input, spec, name, done ) {

  const values = Utils.array( spec.value );

  // Ensure specified value matches acceptable values
  const found = values.some( v => equal( input, v, { strict: true } ) );

  if ( found ) {
    return formatValue( input, spec, name, done );
  }

  done(
    {
      field: name,
      reason: `Unacceptable value provided for field ${name}.`,
      err: new Error( 'Invalid input.' )
    },
    null
  );

}

function validateType( input, spec, name, done ) {

  let types = Utils.array( spec.type );

  // Loop through all types
  ( function nextType( i, n ) {

    // Throw error if no type matched
    if ( i >= n ) {
      return done(
        {
          field: name,
          reason: `Incompatible type of value provided for field ${name}.`,
          err: new Error( 'Invalid input.' )
        },
        null
      );
    }

    if ( !types[ i ] && types[ i ] !== null ) {
      return done(
        {
          type: 'specification',
          field: name,
          reason: 'Invalid type specified.',
          err: new Error( 'Invalid specification.' )
        },
        null
      );
    }

    // Validate null type
    if ( Object.prototype.toString.call( types[ i ] ) === '[object Null]' ) {

      if ( input === null ) {
        return done( null, input );
      }

      return nextType( i + 1, n );

    }

    // Validate object type
    else if ( Object.prototype.toString.call( types[ i ] ) === '[object Object]' ) {

      // Ensure input is an object
      if ( Object.prototype.toString.call( input ) !== '[object Object]' ) {
        return nextType( i + 1, n );
      }

      let obj = {};

      let props = Object.keys( types[ i ] );

      // Loop through all properties in spec
      ( function nextProp( j, m, success ) {

        if ( j >= m ) {
          return success( obj );
        }

        let p = props[ j ];

        // Handle $anyOf operator
        if ( p === '$anyOf' ) {

          // Ensure $anyOf is an array
          if ( !Array.isArray( types[ i ][ p ] ) ) {
            return done(
              {
                type: 'specification',
                field: `${name}.type.${p}`,
                reason: `Invalid type of value specified for field ${name}.type.${p}.`,
                err: new Error( 'Invalid specification.' )
              },
              null
            );
          }

          // Loop through specs in $anyOf until one matches
          ( function nextSpec( k, l ) {

            // If we've gone through all specs, that means none of them matched, so move onto the next type
            if ( k >= l ) {
              return nextType( i + 1, n );
            }

            // Validate input based on spec
            validate( input, { type: types[ i ][ p ][ k ], required: true }, name, function ( err, result ) {

              // If there is an error, then continue to next $anyOf spec
              if ( err ) {

                // Stop immediately upon specification error
                if ( err.type === 'specification' ) {
                  return done( err, null );
                }

                return nextSpec( k + 1, l );

              }

              // Loop through each prop in the result and add to obj
              let failed = Object.keys( result ).some( function ( prop ) {

                // Ensure prop q does not already exist
                if ( prop in obj && !equal( obj[ prop ], result[ prop ], { strict: true } ) ) {

                  done(
                    {
                      type: 'specification',
                      field: `${name}.type.${p}[${k}].${prop}`,
                      reason: `Property ${name}.${prop} already exists for field ${name}.type.${p}[${k}].${prop}.`,
                      err: new Error( 'Invalid specification.' )
                    },
                    null
                  );

                  return true;

                }

                obj[ prop ] = result[ prop ];

              } );

              if ( !failed ) {
                nextProp( j + 1, m, success );
              }

            } );

          } )( 0, types[ i ][ p ].length );

        }

        // Handle $allOf operator
        else if ( p === '$allOf' ) {

          // Ensure $allOf is an array
          if ( !Array.isArray( types[ i ][ p ] ) ) {
            return done(
              {
                type: 'specification',
                field: `${name}.type.${p}`,
                reason: `Invalid type of value specified for field ${name}.type.${p}.`,
                err: new Error( 'Invalid specification.' )
              },
              null
            );
          }

          const allOfObj = {};

          // Loop through specs in $allOf to see if they all match
          ( function nextSpec( k, l ) {

            // If we've gone through all specs, that means all of them matched, so move onto next prop
            if ( k >= l ) {

              // Loop through each prop in the result and add to obj
              const failed = Object.keys( allOfObj ).some( prop => {

                // Ensure prop q does not already exist
                if ( prop in obj && !equal( obj[ prop ], allOfObj[ prop ], { strict: true } ) ) {

                  done(
                    {
                      type: 'specification',
                      field: `${name}.type.${p}[${k}].${prop}`,
                      reason: `Property ${name}.${prop} already exists for field ${name}.type.${p}[${k}].${prop}.`,
                      err: new Error( 'Invalid specification.' )
                    },
                    null
                  );

                  return true;

                }

                obj[ prop ] = allOfObj[ prop ];
                return false;

              } );

              if ( !failed ) {
                nextProp( j + 1, m, success );
              }

              return;

            }

            // Validate input based on spec
            validate( input, { type: types[ i ][ p ][ k ], required: true }, name, function ( err, result ) {

              // If there is an error, then move onto the next type
              if ( err ) {

                // Stop immediately upon specification error
                if ( err.type === 'specification' ) {
                  return done( err, null );
                }

                return nextType( i + 1, n );

              }

              // Loop through each prop in the result and add to obj
              let failed = Object.keys( result ).some( prop => {

                // Ensure prop q does not already exist
                if ( prop in allOfObj && !equal( allOfObj[ prop ], result[ prop ], { strict: true } ) ) {

                  done(
                    {
                      type: 'specification',
                      field: `${name}.type.${p}[${k}].${prop}`,
                      reason: `Property ${name}.${prop} already exists for field ${name}.type.${p}[${k}].${prop}.`,
                      err: new Error( 'Invalid specification.' )
                    },
                    null
                  );

                  return true;

                }

                allOfObj[ prop ] = result[ prop ];
                return false;

              } );

              if ( !failed ) {
                nextSpec( k + 1, l );
              }

            } );

          } )( 0, types[ i ][ p ].length );

        }

        // Skip $wildcards operator
        else if ( p === '$wildcards' ) {
          nextProp( j + 1, m, success );
        }

        else {

          // Validate property
          validate( input[ p ], types[ i ][ p ], `${name}.${p}`, function ( err, result ) {

            // If there is an error, then continue to next type
            if ( err ) {

              // Stop immediately upon specification error
              if ( err.type === 'specification' ) {
                return done( err, null );
              }

              return nextType( i + 1, n );

            }

            // Assign result to output prop
            if ( result !== undefined ) {

              // q is the prop we're assigning to
              let q = p;

              // Check if we need to rename the prop
              if ( 'rename' in types[ i ][ p ] ) {

                // Ensure rename value is a string
                if ( Object.prototype.toString.call( types[ i ][ p ].rename ) !== '[object String]' ) {
                  return done(
                    {
                      type: 'specification',
                      field: `${name}.type.${p}.rename`,
                      reason: `Invalid type of value specified for field ${name}.type.${p}.rename.`,
                      err: new Error( 'Invalid specification.' )
                    },
                    null
                  );
                }

                q = types[ i ][ p ].rename;

              }

              // Ensure prop q does not already exist
              if ( q in obj && !equal( obj[ p ], result, { strict: true } ) ) {
                return done(
                  {
                    type: 'specification',
                    field: `${name}.type.${p}`,
                    reason: `Property ${q} already exists for field ${name}.type.${p}.`,
                    err: new Error( 'Invalid specification.' )
                  },
                  null
                );
              }

              if ( Object.prototype.toString.call( types[ i ][ p ].type ) === '[object Object]' &&
                'flatten' in types[ i ][ p ] &&
                types[ i ][ p ].flatten ) {

                let opts = { safe: true };

                if ( typeof types[ i ][ p ].flatten !== 'boolean' ) {
                  opts.maxDepth = types[ i ][ p ].flatten
                }

                result = flat( result, opts );

                Object.keys( result ).forEach( k => obj[ q + '.' + k ] = result[ k ] );

              }
              else {
                obj[ q ] = result;
              }

            }

            nextProp( j + 1, m, success );

          } );

        }

      } )(
        0,
        props.length,
        output => handleWildcardKeys( [ input, name ], output, [ types, i, n, nextType ], done )
      );

    }

    // Validate array type
    else if ( Array.isArray( types[ i ] ) ) {

      // Array validation requires validating each element in the array, so ensure input is an array
      if ( !Array.isArray( input ) ) {
        return nextType( i + 1, n );
      }

      // Check if we need to validate length
      if ( 'array' in spec && 'length' in spec.array ) {

        // Ensure min length
        if ( 'min' in spec.array.length && input.length < spec.array.length.min ) {
          return nextType( i + 1, n );
        }

        // Ensure max length
        if ( 'max' in spec.array.length && input.length > spec.array.length.max ) {
          return nextType( i + 1, n );
        }

      }

      // Loop through all specs in array type
      ( function nextElemType( j, m ) {

        // If we've gone through all specs and haven't found a match, continue to next type
        if ( j >= m ) {
          return nextType( i + 1, n );
        }

        // Validate each element in the input array
        ( function nextElem( k, l ) {

          // If we've gone through all elements, that means they all match, so type validation is successful
          if ( k >= l ) {
            return done( null, input );
          }

          // Check if input matches spec
          validate( input[ k ], types[ i ][ j ], `${name}[${k}]`, function ( err, result ) {

            // If there is an error, then continue to next element type
            if ( err ) {

              // Stop immediately upon specification error
              if ( err.type === 'specification' ) {
                return done( err, null );
              }

              return nextElemType( j + 1, m );

            }

            // We found a match so replace the input value with the validated value
            input[ k ] = result;

            // If we have recursively traversed the array up to the depth then do a timeout to reset the callstack depth
            if ( ( k + 1 ) % RECURSIVE_DEPTH === 0 ) {
              return setTimeout( () => nextElem( k + 1, l ), 0 );
            }

            nextElem( k + 1, l );

          } );

        } )( 0, input.length );

      } )( 0, types[ i ].length );

    }

    // Validate primitive types
    else if ( Object.prototype.toString.call( input ) === Object.prototype.toString.call( types[ i ].prototype ) ) {

      if ( types[ i ].prototype === Number.prototype ) {

        // Ensure min length
        if ( 'min' in spec && input < spec.min ) {
          return done(
            {
              field: name,
              reason: `Value for field '${name}' smaller than specified minimum of ${spec.min}.`,
              err: new Error( 'Invalid specification.' )
            },
            null
          );
        }

        // Ensure max length
        if ( 'max' in spec && input > spec.max ) {
          return done(
            {
              field: name,
              reason: `Value for field '${name}' larger than specified maximum of ${spec.max}.`,
              err: new Error( 'Invalid specification.' )
            },
            null
          );
        }

      }

      else if ( types[ i ].prototype === String.prototype && 'string' in spec && 'length' in spec.string ) {

        // Ensure min length
        if ( 'min' in spec.string.length && input.length < spec.string.length.min ) {
          return done(
            {
              field: name,
              reason: `Length for field '${name}' smaller than specified minimum of ${spec.string.length.min}.`,
              err: new Error( 'Invalid specification.' )
            },
            null
          );
        }

        // Ensure max length
        if ( 'max' in spec.string.length && input.length > spec.string.length.max ) {
          return done(
            {
              field: name,
              reason: `Length for field '${name}' larger than specified maximum of ${spec.string.length.max}.`,
              err: new Error( 'Invalid specification.' )
            },
            null
          );
        }

      }

      done( null, input );

    }

    else {
      nextType( i + 1, n );
    }

  } )( 0, types.length );

}

function handleWildcardKeys( [ input, name ], output, [ types, i, n, nextType ], done ) {

  const type = types[ i ];
  const props = Object.keys( type );
  const wildcards = Utils.array( type.$wildcards );

  ( function nextWildcard( j, m, end ) {

    if ( j >= m ) {
      return end();
    }

    const wildcard = wildcards[ j ];

    let matcher;

    if ( wildcard.name instanceof RegExp ) {
      matcher = p => wildcard.name.test( p );
    }
    else if ( Utils.isFunction( wildcard.name ) ) {
      matcher = p => wildcard.name( p );
    }
    else {
      return done(
        {
          type: 'specification',
          field: `${name}.type[${i}].$wildcards[${j}].name`,
          reason: `Invalid type of value specified for field ${name}.type[${i}].$wildcards[${j}].name.`,
          err: new Error( 'Invalid specification.' )
        },
        null
      );
    }

    // Find matching props
    const wildcardProps = Object.keys( input )                       // Input props
      .filter( p => !props.includes( p ) ) // Exclude defined props
      .filter( p => !( p in output ) )     // Exclude validated props
      .filter( matcher );                  // Ensure wildcard matches

    // Validate each prop
    ( function nextWildcardProp( k, l, end ) {

      if ( k >= l ) {
        return end();
      }

      const p = wildcardProps[ k ];

      // Validate property
      validate( input[ p ], wildcard, `${name}.${p}`, ( err, result ) => {

        // If there is an error, then continue to next type
        if ( err ) {

          // Stop immediately upon specification error
          if ( err.type === 'specification' ) {
            return done( err, null );
          }

          return nextType( i + 1, n );

        }

        if ( result !== undefined ) {
          output[ p ] = result;
        }

        nextWildcardProp( k + 1, l, end );

      } );

    } )( 0, wildcardProps.length, () => nextWildcard( j + 1, m, end ) );

  } )( 0, wildcards.length, () => done( null, output ) );

}

// TODO: SUPPORT CUSTOM FORMAT FUNCTIONS
function formatValue( input, spec, name, done ) {

  if ( !( 'format' in spec ) ) {
    return done( null, input );
  }

  // Ensure valid format
  if ( !( spec.format in formats ) && typeof spec.format !== 'function' ) {
    return done(
      {
        type: 'specification',
        field: `${name}.format`,
        reason: `Invalid format specified: ${spec.format}`,
        err: new Error( 'Invalid specification.' )
      },
      null
    );
  }

  try {

    // Format value
    done( null, ( formats[ spec.format ] || spec.format )( input ) );

  }
  catch ( err ) {
    done(
      {
        type: 'validation',
        field: name,
        reason: err.message,
        err: 'Unable to format value.'
      },
      null
    );
  }

}

function formatDate( value ) {

  const date = moment( value );

  if ( date.isValid() ) {
    return date.toDate();
  }

  throw new Error( 'Invalid date.' );

}

function formatMoment( value ) {

  const date = moment( value );

  if ( date.isValid() ) {
    return date;
  }

  throw new Error( 'Invalid date.' );

}

function formatISODate( value ) {

  const date = moment( value );

  if ( date.isValid() ) {
    return date.toISOString();
  }

  throw new Error( 'Invalid date.' );

}

function formatMongoDBObjectID( value ) {
  return new mongodb.ObjectID.createFromHexString( value );
}

function trimString( value ) {
  return value.trim();
}

function formatPhone( value ) {

  if ( typeof value === 'number' ) {
    value = String( value );
  }

  if ( typeof value === 'string' ) {
    return value.replace( /[^+0-9]/g, '' );
  }

  if ( Array.isArray( value ) ) {
    return value.map( formatPhone ).filter( i => i );
  }

  if ( value && typeof value === 'object' ) {

    const obj = {};

    for ( const [ k, v ] of Object.entries( value ) ) {

      const n = formatPhone( v );

      if ( n ) {
        obj[ k ] = n;
      }

    }

    return obj;

  }

}
