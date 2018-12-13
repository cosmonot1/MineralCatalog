'use strict';

const pkg = require( '../../package' );
const Config = require( '../../utils/config' )( pkg.name ).current;
const CatalogNumber = require( './catalog-number' );
const validate = require( '../../utils/validate' );
const mongojs = require( '../../utils/mongojs' );
const Schemas = require( '../../utils/schemas' );
const Utils = require( '../../utils' );
const uuid = require( 'uuid' );

const p = Utils.promisify;
const collection = mongojs( Config().services.db.mongodb.uri, [ 'specimens' ] ).specimens;

createIndexes();

module.exports = {
  add,
  createIndexes,
  get,
  list,
  remove,
  update
};

async function add( data ) {

  const { specimen } = await validate(
    data,
    {
      type: { 
        specimen: {
          type: Schemas.specimen_add_ref,
          required: true
        }
      },
      required: true
    },
    'data'
  );

  Object.assign(
    specimen,
    {
      _id: uuid.v4(),
      catalog_number: await CatalogNumber.getAndInc().then( result => result.catalog_number.number ),
      timestamps: {
        created: new Date()
      }
    }
  );

  const result = await p( collection.insert )( specimen ).catch( err => {

    // Check for duplicate key error
    if ( err.message && err.message.startsWith( 'E11000' ) ) {
      throw {
        code: 409,
        operation: 'specimen.add',
        type: 'conflict',
        reason: 'Specimen with that catalog number already exists.',
        err: new Error( 'Conflict.' )
      };
    }

    throw err;

  } );

  return { specimen: result };

}

// TODO: indexes for efficiency
function createIndexes() {
  collection.createIndex( { catalog_number: 1 }, { unique: true } );
  collection.createIndex( { 'species.main': 1 } );
  collection.createIndex( { 'species.additional': 1 } );
}

async function get( data ) {

  const { specimen, projection } = await validate(
    data,
    {
      type: {
        specimen: {
          type: Schemas.specimen_get_ref,
          required: true
        },
        projection: Schemas.default_projection_field
      },
      required: true
    },
    'data'
  );

  const result = await p( collection.findOne.bind( collection ) )( specimen, projection );

  if ( !result ) {
    throw {
      code: 404,
      operation: 'specimen.get',
      type: 'not-found',
      entity: 'specimen',
      reason: 'Specimen not found.',
      err: new Error( 'Not found.' )
    };
  }

  return { specimen: result };

}

async function list( data ) {

  if ( '$and' in data.specimen && !data.specimen.$and.length ) {
    delete data.specimen.$and;
  }

  const { specimen, projection, sort, offset, limit } = await validate(
    data,
    {
      type: {
        specimen: {
          type: Schemas.specimen_list_ref,
          required: true
        },
        projection: Schemas.default_projection_field,
        sort: {
          type: {
            species: {
              value: [ -1, 1 ]
            },
            'timestamps.created': {
              value: [ -1, 1 ]
            },
            catalog_number: {
              value: [ -1, 1 ]
            }
          },
          default: {
            catalog_number: 1
          }
        },
        offset: {
          type: Number,
          default: 0
        },
        limit: {
          type: Number,
          default: 0
        }
      },
      required: true
    },
    'data'
  );

  const total = await p( collection.count.bind( collection ) )( specimen );

  const cursor = collection.find( specimen, projection )
    .sort( sort )
    .skip( offset );

  const specimens = await p( cursor.limit.bind( cursor ) )( limit );

  return {
    total,
    offset,
    limit,
    specimens
  };

}

async function remove( data ) {

  const { specimen, projection } = await validate(
    data,
    {
      type: {
        specimen: {
          type: Schemas.specimen_get_ref,
          required: true
        },
        projection: Schemas.default_projection_field
      },
      required: true
    },
    'data'
  );

  const result = await p( collection.findAndModify )(
    {
      query: specimen,
      remove: true,
      fields: projection
    }
  );

  if ( !result ) {
    throw {
      code: 404,
      operation: 'specimen.remove',
      type: 'not-found',
      entity: 'specimen',
      reason: 'Specimen not found.',
      err: new Error( 'Not found.' )
    };
  }

  return {
    specimen: result
  };

}

async function update( data ) {

  const { specimen, set, projection } = await validate(
    data,
    {
      type: {
        specimen: {
          type: Schemas.specimen_get_ref,
          required: true
        },
        set: {
          type: Schemas.specimen_update_data,
          required: true
        },
        projection: Schemas.default_projection_field
      },
      required: true
    },
    'data'
  );

  const result = await p( collection.findAndModify )(
    {
      query: specimen,
      update: {
        $set: set,
        $currentDate: {
          'timestamps.modified': true
        }
      },
      new: true,
      fields: projection
    }
  ).catch( err => {

    if ( err.message && err.message.startsWith( 'E11000' ) ) {
      throw {
        code: 409,
        operation: 'specimen.update',
        type: 'conflict',
        reason: 'A specimen with that catalog number already exists.',
        err: new Error( 'Conflict.' )
      };
    }

    throw err;

  } );

  if ( !result ) {
    throw {
      code: 404,
      operation: 'specimen.update',
      type: 'not-found',
      entity: 'specimen',
      reason: 'Specimen not found.',
      err: new Error( 'Not found.' )
    };
  }

  return {
    specimen: result
  };

}
