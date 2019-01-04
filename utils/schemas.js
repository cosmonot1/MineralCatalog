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

module.exports.addString = { type: String, format: ( s ) => s.toLowerCase(), default: '' };

module.exports.addBoolean = { type: Boolean, default: false };

module.exports.addNumber = { type: Number, default: 0 };

module.exports.default_projection_field = {
  type: Object,
  default: {}
};

module.exports.specimen_add_ref = {
  photos: {
    type: {
      main: module.exports.addString,
      all: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ], default: [] },
    },
    default: {}
  },
  physical_dimensions: {
    type: {
      weight: module.exports.addNumber,
      length: module.exports.addNumber,
      width: module.exports.addNumber,
      height: module.exports.addNumber,
      main_crystal: module.exports.addNumber,
    },
    default: {}
  },
  species: {
    type: {
      main: module.exports.addString,
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
      stope: module.exports.addString,
      level: module.exports.addString,
      mine: module.exports.addString,
      district: module.exports.addString,
      state: module.exports.addString,
      country: module.exports.addString,

    },
    default: {}
  },
  analysis: {
    type: {
      analyzed: module.exports.addBoolean,
      by: module.exports.addString,
      method: module.exports.addString
    },
    default: {}
  },
  acquired: {
    type: {
      date: { format: 'date', default: 0 },
      paid: module.exports.addNumber,
      from: module.exports.addString,
      where: module.exports.addString
    },
    default: {}
  },
  states: {
    type: {
      old_label: module.exports.addBoolean,
      repair: module.exports.addBoolean,
      story: module.exports.addBoolean,
      figured: module.exports.addBoolean
    },
    default: {}
  },
  storage_location: {
    type: {
      exhibit: module.exports.addBoolean,
      inside: module.exports.addBoolean,
      outside: module.exports.addBoolean,
      loan: module.exports.addBoolean,
      details: module.exports.addString
    },
    default: {}
  },
  geology: {
    type: {
      metamorphic: module.exports.addBoolean,
      pegmatite: module.exports.addBoolean,
      porphyry: module.exports.addBoolean,
      crd_skarn: module.exports.addBoolean,
      epithermal_vein: module.exports.addBoolean,
      volcanic_related: module.exports.addBoolean,
      exhalite: module.exports.addBoolean,
      mvt: module.exports.addBoolean,
      evaporite: module.exports.addBoolean,
      other: module.exports.addString,
    },
    default: {}
  },
  exhibit_history: {
    type: [ [ {
      type: {
        show: module.exports.addString,
        year: module.exports.addNumber,
        comp: module.exports.addString,
        award: module.exports.addString
      }
    } ] ],
    default: []
  },
  features: {
    type: {
      twinned: module.exports.addBoolean,
      pseudomorph: module.exports.addBoolean,
      inclusions: module.exports.addBoolean,
      photosensitive: module.exports.addBoolean
    },
    default: {}
  },
  fluorescence: {
    type: {
      sw: module.exports.addBoolean,
      sw_details: module.exports.addString,
      lw: module.exports.addBoolean,
      lw_details: module.exports.addString
    },
    default: {}
  },
  quality: {
    type: {
      exceptional: module.exports.addBoolean,
      exhibit: module.exports.addBoolean,
      locality: module.exports.addBoolean,
      study: module.exports.addBoolean,
    },
    default: {}
  },
  // add_to_locality: { //TODO: finish this one
  //   type: {
  //     type_locality: module.exports.addBoolean,
  //     self_collected: module.exports.addBoolean,
  //     when: { format: 'date' }
  //   },
  //   default: {}
  // },
  // photographed: { //TODO: finish this one
  //   type: {
  //     photographed: module.exports.addBoolean,
  //     by: module.exports.addString,
  //     photo_file_number: module.exports.addString
  //   },
  //   default: {}
  // },
  comments: module.exports.addString,
  story: module.exports.addString,
  figured: module.exports.addString,
  repair_history: module.exports.addString,
  analysis_history: module.exports.addString,
  specimen_location: module.exports.addString,
  documents: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ], default: [] }
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
  'timestamps.modified': { type: module.exports.dateType },
  'exhibit_history.show': { type: module.exports.stringType },
  'exhibit_history.year': { type: module.exports.numericType },
  'exhibit_history.comp': { type: module.exports.stringType },
  'exhibit_history.award': { type: module.exports.stringType },
  'geology.metamorphic': { type: module.exports.booleanType },
  'geology.pegmatite': { type: module.exports.booleanType },
  'geology.porphyry': { type: module.exports.booleanType },
  'geology.crd_skarn': { type: module.exports.booleanType },
  'geology.epithermal_vein': { type: module.exports.booleanType },
  'geology.volcanic_related': { type: module.exports.booleanType },
  'geology.exhalite': { type: module.exports.booleanType },
  'geology.mvt': { type: module.exports.booleanType },
  'geology.evaporite': { type: module.exports.booleanType },
  'geology.other': { type: module.exports.booleanType },
  'features.twinned': { type: module.exports.booleanType },
  'features.pseudomorph': { type: module.exports.booleanType },
  'features.inclusions': { type: module.exports.booleanType },
  'features.photosensitive': { type: module.exports.booleanType },
  'fluorescence.sw': { type: module.exports.booleanType },
  'fluorescence.sw_details': { type: module.exports.stringType },
  'fluorescence.lw': { type: module.exports.booleanType },
  'fluorescence.lw_details': { type: module.exports.stringType },
  'quality.exceptional': { type: module.exports.booleanType },
  'quality.exhibit': { type: module.exports.booleanType },
  'quality.locality': { type: module.exports.booleanType },
  'quality.study': { type: module.exports.booleanType }
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
      main: { type: String, format: ( s ) => s.toLowerCase() },
      all: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ] },
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
  geology: {
    type: {
      metamorphic: { type: Boolean },
      pegmatite: { type: Boolean },
      porphyry: { type: Boolean },
      crd_skarn: { type: Boolean },
      epithermal_vein: { type: Boolean },
      volcanic_related: { type: Boolean },
      exhalite: { type: Boolean },
      mvt: { type: Boolean },
      evaporite: { type: Boolean },
      other: { type: String, format: ( s ) => s.toLowerCase() },
    }
  },
  exhibit_history: {
    type: [ [ {
      type: {
        show: { type: String, format: ( s ) => s.toLowerCase() },
        year: { type: Number },
        comp: { type: String, format: ( s ) => s.toLowerCase() },
        award: { type: String, format: ( s ) => s.toLowerCase() }
      }
    } ] ]
  },
  features: {
    type: {
      twinned: { type: Boolean },
      pseudomorph: { type: Boolean },
      inclusions: { type: Boolean },
      photosensitive: { type: Boolean }
    }
  },
  fluorescence: {
    type: {
      sw: { type: Boolean },
      sw_details: { type: String },
      lw: { type: Boolean },
      lw_details: { type: String }
    }
  },
  quality: {
    type: {
      exceptional: { type: Boolean },
      exhibit: { type: Boolean },
      locality: { type: Boolean },
      study: { type: Boolean }
    }
  },
  comments: { type: String, format: ( s ) => s.toLowerCase() },
  story: { type: String, format: ( s ) => s.toLowerCase() },
  figured: { type: String, format: ( s ) => s.toLowerCase() },
  repair_history: { type: String, format: ( s ) => s.toLowerCase() },
  analysis_history: { type: String, format: ( s ) => s.toLowerCase() },
  specimen_location: { type: String, format: ( s ) => s.toLowerCase() },
  documents: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ] }
};
