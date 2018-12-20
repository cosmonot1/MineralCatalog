'use strict';

module.exports = {};

module.exports.numericType = {
  '$eq': { type: Number },
  '$gt': { type: Number },
  '$lt': { type: Number },
  '$ne': { type: Number }
};

module.exports.dateType = {
  '$eq': { type: [ Number, String ], format: 'date' },
  '$gt': { type: [ Number, String ], format: 'date' },
  '$lt': { type: [ Number, String ], format: 'date' },
  '$ne': { type: [ Number, String ], format: 'date' }
};

module.exports.stringType = {
  '$eq': { type: String, format: ( s ) => s.toLowerCase() },
  '$regex': { type: String, format: ( s ) => s.toLowerCase() },
  '$ne': { type: String, format: ( s ) => s.toLowerCase() }
};

module.exports.booleanType = {
  '$eq': { type: Boolean },
  '$ne': { type: Boolean }
};

module.exports.default_projection_field = {
  type: Object,
  default: {}
};

module.exports.specimen_add_ref = {
  photos: {
    type: {
      main: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
      all: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ], default: [] },
    },
    default: {}
  },
  physical_dimensions: {
    type: {
      weight: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      main_crystal: { type: Number, default: 0 },
    },
    default: {}
  },
  species: {
    type: {
      main: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
      additional: {
        type: [ [ {
          type: {
            modifier: { type: String, required: true, format: ( s ) => s.toLowerCase() },
            species: { type: String, required: true, format: ( s ) => s.toLowerCase() }
          }
        } ] ], default: []
      },
    },
    default: {}
  },
  discovery_location: {
    type: {
      stope: { type: String, format: ( s ) => s.toLowerCase() },
      level: { type: String, format: ( s ) => s.toLowerCase() },
      mine: { type: String, format: ( s ) => s.toLowerCase() },
      district: { type: String, format: ( s ) => s.toLowerCase() },
      state: { type: String, format: ( s ) => s.toLowerCase() },
      country: { type: String, format: ( s ) => s.toLowerCase() }
    },
    default: {}
  },
  analysis: {
    type: {
      analyzed: { type: Boolean, default: false },
      by: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
      method: { type: String, format: ( s ) => s.toLowerCase(), default: '' }
    },
    default: {}
  },
  acquired: {
    type: {
      date: { format: 'date', default: 0 },
      paid: { type: Number, default: 0 },
      from: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
      where: { type: String, format: ( s ) => s.toLowerCase(), default: '' }
    },
    default: {}
  },
  states: {
    type: {
      old_label: { type: Boolean, default: false },
      repair: { type: Boolean, default: false },
      story: { type: Boolean, default: false },
      figured: { type: Boolean, default: false }
    },
    default: {}
  },
  storage_location: {
    type: {
      exhibit: { type: Boolean, deafult: false },
      inside: { type: Boolean, deafult: false },
      outside: { type: Boolean, deafult: false },
      loan: { type: Boolean, deafult: false },
      details: { type: String, format: ( s ) => s.toLowerCase(), default: '' }
    },
    default: {}
  },
  comments: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
  story: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
  figured: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
  repair_history: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
  analysis_history: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
  specimen_location: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
};

module.exports.specimen_get_ref = {
  $anyOf: [
    {
      _id: { type: String, format: ( s ) => s.toLowerCase(), required: true },
    },
    {
      catalog_number: { type: String, format: ( s ) => s.toLowerCase(), required: true }
    }
  ]
};

module.exports.specimen_list_fields = {
  'catalog_number': { type: [ Number, module.exports.numericType ] },
  'physical_dimensions.weight': { type: [ Number, module.exports.numericType ] },
  'physical_dimensions.length': { type: [ Number, module.exports.numericType ] },
  'physical_dimensions.width': { type: [ Number, module.exports.numericType ] },
  'physical_dimensions.height': { type: [ Number, module.exports.numericType ] },
  'physical_dimensions.main_crystal': { type: [ Number, module.exports.numericType ] },
  'species.main': { type: [ String, module.exports.stringType ] },
  'species.additional.species': { type: [ String, module.exports.stringType ] },
  'discovery_location.stope': { type: [ String, module.exports.stringType ] },
  'discovery_location.level': { type: [ String, module.exports.stringType ] },
  'discovery_location.mine': { type: [ String, module.exports.stringType ] },
  'discovery_location.district': { type: [ String, module.exports.stringType ] },
  'discovery_location.state': { type: [ String, module.exports.stringType ] },
  'discovery_location.country': { type: [ String, module.exports.stringType ] },
  'analysis.analyzed': { type: [ Boolean, module.exports.booleanType ] },
  'analysis.by': { type: [ String, module.exports.stringType ] },
  'analysis.method': { type: [ String, module.exports.stringType ] },
  'acquired.date': { type: module.exports.dateType },
  'acquired.paid': { type: [ Number, module.exports.numericType ] },
  'acquired.from': { type: [ String, module.exports.stringType ] },
  'acquired.where': { type: [ String, module.exports.stringType ] },
  'states.old_label': { type: [ Boolean, module.exports.booleanType ] },
  'states.repair': { type: [ Boolean, module.exports.booleanType ] },
  'states.story': { type: [ Boolean, module.exports.booleanType ] },
  'states.figured': { type: [ Boolean, module.exports.booleanType ] },
  'storage_location.exhibit': { type: [ Boolean, module.exports.booleanType ] },
  'storage_location.inside': { type: [ Boolean, module.exports.booleanType ] },
  'storage_location.outside': { type: [ Boolean, module.exports.booleanType ] },
  'storage_location.loan': { type: [ Boolean, module.exports.booleanType ] },
  'storage_location.details': { type: [ String, module.exports.stringType ] },
  'comments': { type: [ String, module.exports.stringType ] },
  'story': { type: [ String, module.exports.stringType ] },
  'figured': { type: [ String, module.exports.stringType ] },
  'repair_history': { type: [ String, module.exports.stringType ] },
  'analysis_history': { type: [ String, module.exports.stringType ] },
  'specimen_location': { type: [ String, module.exports.stringType ] },
  'timestamps.created': { type: module.exports.dateType },
  'timestamps.modified': { type: module.exports.dateType }
};

module.exports.specimen_list_ref = Object.assign(
  {},
  module.exports.specimen_list_fields,
  {
    $and: {
      type: [ [ { type: module.exports.specimen_list_fields } ] ]
    }
  }
);

// Don't allow change of catalog number
module.exports.specimen_update_data = {
  photos: {
    type: {
      main: { type: String, format: ( s ) => s.toLowerCase(), default: '' },
      all: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ], default: [] },
    },
    flatten: true
  },
  physical_dimensions: {
    type: {
      weight: { type: Number },
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      main_crystal: { type: Number },
    },
    flatten: true
  },
  species: {
    type: {
      main: { type: String, format: ( s ) => s.toLowerCase() },
      additional: {
        type: [ [ {
          type: {
            modifier: { type: String, required: true, format: ( s ) => s.toLowerCase() },
            species: { type: String, required: true, format: ( s ) => s.toLowerCase() }
          }
        } ] ], default: []
      }
    },
    flatten: true
  },
  discovery_location: {
    type: {
      stope: { type: String, format: ( s ) => s.toLowerCase() },
      level: { type: String, format: ( s ) => s.toLowerCase() },
      mine: { type: String, format: ( s ) => s.toLowerCase() },
      district: { type: String, format: ( s ) => s.toLowerCase() },
      state: { type: String, format: ( s ) => s.toLowerCase() },
      country: { type: String, format: ( s ) => s.toLowerCase() }
    },
    flatten: true
  },
  analysis: {
    type: {
      analyzed: { type: Boolean },
      by: { type: String, format: ( s ) => s.toLowerCase() },
      method: { type: String, format: ( s ) => s.toLowerCase() }
    },
    flatten: true
  },
  acquired: {
    type: {
      date: { format: 'date' },
      paid: { type: Number },
      from: { type: String, format: ( s ) => s.toLowerCase() },
      where: { type: String, format: ( s ) => s.toLowerCase() }
    },
    flatten: true
  },
  states: {
    type: {
      old_label: { type: Boolean },
      repair: { type: Boolean },
      story: { type: Boolean },
      figured: { type: Boolean }
    },
    flatten: true
  },
  storage_location: {
    type: {
      exhibit: { type: Boolean },
      inside: { type: Boolean },
      outside: { type: Boolean },
      loan: { type: Boolean },
      details: { type: String, format: ( s ) => s.toLowerCase() }
    },
    flatten: true
  },
  comments: { type: String, format: ( s ) => s.toLowerCase() },
  story: { type: String, format: ( s ) => s.toLowerCase() },
  figured: { type: String, format: ( s ) => s.toLowerCase() },
  repair_history: { type: String, format: ( s ) => s.toLowerCase() },
  analysis_history: { type: String, format: ( s ) => s.toLowerCase() },
  specimen_location: { type: String, format: ( s ) => s.toLowerCase() }
};
