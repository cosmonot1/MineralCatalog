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
  '$eq': { type: String, format: ( s ) => s.trim().toLowerCase() },
  '$regex': { type: String, format: ( s ) => s.trim().toLowerCase() },
  '$ne': { type: String, format: ( s ) => s.trim().toLowerCase() }
};

module.exports.booleanType = {
  '$eq': { type: Boolean },
  '$ne': { type: Boolean }
};

module.exports.addString = { type: String, format: ( s ) => s.trim().toLowerCase(), default: '' };

module.exports.addBoolean = { type: Boolean, default: false };

module.exports.addNumber = { type: [ null, Number ], default: null };

module.exports.default_projection_field = {
  type: Object,
  default: {}
};

module.exports.specimen_add_ref = {
  photos: {
    type: {
      main: module.exports.addString,
      all: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ], default: [] },
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
            modifier: { type: String, required: true, format: ( s ) => s.trim().toLowerCase() },
            species: { type: String, required: true, format: ( s ) => s.trim().toLowerCase() }
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
  locality: {
    type: {
      type_locality: module.exports.addBoolean,
      self_collected: module.exports.addBoolean,
      when: { format: 'date' }
    },
    default: {}
  },
  photographed: {
    type: {
      photographed: module.exports.addBoolean,
      by: module.exports.addString,
      photo_file_number: module.exports.addString,
      files: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ], default: [] }
    },
    default: {}
  },
  provenance: {
    type: {
      old_labels: module.exports.addBoolean,
      prior_labels: module.exports.addBoolean,
      former_owners: {
        type: [ [ {
          type: {
            owner: module.exports.addString,
            year_acquired: { format: 'date' }
          }
        } ] ]
      },
      prior_catalog_number: module.exports.addNumber,
      label: module.exports.addBoolean,
      label_files: { type: [ [ { type: String, format: ( s ) => s.toLowerCase() } ] ], default: [] },
      miguel_romero: module.exports.addBoolean,
      miguel_romero_number: module.exports.addNumber
    },
    default: {}
  },
  comments: module.exports.addString,
  story: module.exports.addString,
  figured: module.exports.addString,
  repair_history: module.exports.addString,
  analysis_history: module.exports.addString,
  specimen_location: module.exports.addString,
  documents: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ], default: [] }
};

module.exports.specimen_get_ref = {
  $anyOf: [
    {
      _id: { type: String, format: ( s ) => s.trim().toLowerCase(), required: true },
    },
    {
      catalog_number: { type: String, format: ( s ) => s.trim().toLowerCase(), required: true }
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
  'exhibit_history.show': { type: [ String, module.exports.stringType ] },
  'exhibit_history.year': { type: [ Number, module.exports.numericType ] },
  'exhibit_history.comp': { type: [ String, module.exports.stringType ] },
  'exhibit_history.award': { type: [ String, module.exports.stringType ] },
  'geology.metamorphic': { type: [ Boolean, module.exports.booleanType ] },
  'geology.pegmatite': { type: [ Boolean, module.exports.booleanType ] },
  'geology.porphyry': { type: [ Boolean, module.exports.booleanType ] },
  'geology.crd_skarn': { type: [ Boolean, module.exports.booleanType ] },
  'geology.epithermal_vein': { type: [ Boolean, module.exports.booleanType ] },
  'geology.volcanic_related': { type: [ Boolean, module.exports.booleanType ] },
  'geology.exhalite': { type: [ Boolean, module.exports.booleanType ] },
  'geology.mvt': { type: [ Boolean, module.exports.booleanType ] },
  'geology.evaporite': { type: [ Boolean, module.exports.booleanType ] },
  'geology.other': { type: [ String, module.exports.stringType ] },
  'features.twinned': { type: [ Boolean, module.exports.booleanType ] },
  'features.pseudomorph': { type: [ Boolean, module.exports.booleanType ] },
  'features.inclusions': { type: [ Boolean, module.exports.booleanType ] },
  'features.photosensitive': { type: [ Boolean, module.exports.booleanType ] },
  'fluorescence.sw': { type: [ Boolean, module.exports.booleanType ] },
  'fluorescence.sw_details': { type: [ String, module.exports.stringType ] },
  'fluorescence.lw': { type: [ Boolean, module.exports.booleanType ] },
  'fluorescence.lw_details': { type: [ String, module.exports.stringType ] },
  'quality.exceptional': { type: [ Boolean, module.exports.booleanType ] },
  'quality.exhibit': { type: [ Boolean, module.exports.booleanType ] },
  'quality.locality': { type: [ Boolean, module.exports.booleanType ] },
  'quality.study': { type: [ Boolean, module.exports.booleanType ] },
  'locality.type_locality': { type: [ Boolean, module.exports.booleanType ] },
  'locality.self_collected': { type: [ Boolean, module.exports.booleanType ] },
  'locality.when': { type: module.exports.dateType },
  'photographed.photographed': { type: [ Boolean, module.exports.booleanType ] },
  'photographed.by': { type: [ String, module.exports.stringType ] },
  'photographed.photo_file_number': { type: [ String, module.exports.stringType ] },
  'provenance.old_labels': { type: [ Boolean, module.exports.booleanType ] },
  'provenance.prior_labels': { type: [ Boolean, module.exports.booleanType ] },
  'provenance.former_owners.owner': { type: [ String, module.exports.stringType ] },
  'provenance.former_owners.year_acquired': { type: [ Number, module.exports.numericType ] },
  'provenance.prior_catalog_number': { type: [ Number, module.exports.numericType ] },
  'provenance.label': { type: [ Boolean, module.exports.booleanType ] },
  'provenance.label_files': { type: [ String, module.exports.stringType ] },
  'provenance.miguel_romero': { type: [ Boolean, module.exports.booleanType ] },
  'provenance.miguel_romero_number': { type: [ Number, module.exports.numericType ] },
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
      main: { type: String, format: ( s ) => s.trim().toLowerCase() },
      all: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ] },
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
      main: { type: String, format: ( s ) => s.trim().toLowerCase() },
      additional: {
        type: [ [ {
          type: {
            modifier: { type: String, required: true, format: ( s ) => s.trim().toLowerCase() },
            species: { type: String, required: true, format: ( s ) => s.trim().toLowerCase() }
          }
        } ] ], default: []
      }
    },
    flatten: true
  },
  discovery_location: {
    type: {
      stope: { type: String, format: ( s ) => s.trim().toLowerCase() },
      level: { type: String, format: ( s ) => s.trim().toLowerCase() },
      mine: { type: String, format: ( s ) => s.trim().toLowerCase() },
      district: { type: String, format: ( s ) => s.trim().toLowerCase() },
      state: { type: String, format: ( s ) => s.trim().toLowerCase() },
      country: { type: String, format: ( s ) => s.trim().toLowerCase() }
    },
    flatten: true
  },
  analysis: {
    type: {
      analyzed: { type: Boolean },
      by: { type: String, format: ( s ) => s.trim().toLowerCase() },
      method: { type: String, format: ( s ) => s.trim().toLowerCase() }
    },
    flatten: true
  },
  acquired: {
    type: {
      date: { format: 'date' },
      paid: { type: Number },
      from: { type: String, format: ( s ) => s.trim().toLowerCase() },
      where: { type: String, format: ( s ) => s.trim().toLowerCase() }
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
      details: { type: String, format: ( s ) => s.trim().toLowerCase() }
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
      other: { type: String, format: ( s ) => s.trim().toLowerCase() },
    }
  },
  exhibit_history: {
    type: [ [ {
      type: {
        show: { type: String, format: ( s ) => s.trim().toLowerCase() },
        year: { type: Number },
        comp: { type: String, format: ( s ) => s.trim().toLowerCase() },
        award: { type: String, format: ( s ) => s.trim().toLowerCase() }
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
  locality: {
    type: {
      type_locality: { type: Boolean },
      self_collected: { type: Boolean },
      when: { format: 'date' }
    }
  },
  photographed: {
    type: {
      photographed: { type: Boolean },
      by: { type: String, format: ( s ) => s.trim().toLowerCase() },
      photo_file_number: { type: String, format: ( s ) => s.trim().toLowerCase() },
      files: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ] }
    }
  },
  provenance: {
    type: {
      old_labels: { type: Boolean },
      prior_labels: { type: Boolean },
      former_owners: {
        type: [ [ {
          type: {
            owner: { type: String, format: ( s ) => s.trim().toLowerCase() },
            year_acquired: { format: 'date' }
          }
        } ] ]
      },
      prior_catalog_number: { type: Number },
      label: { type: Boolean },
      label_files: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ] },
      miguel_romero: { type: Boolean },
      miguel_romero_number: { type: Number },
    }
  },
  comments: { type: String, format: ( s ) => s.trim().toLowerCase() },
  story: { type: String, format: ( s ) => s.trim().toLowerCase() },
  figured: { type: String, format: ( s ) => s.trim().toLowerCase() },
  repair_history: { type: String, format: ( s ) => s.trim().toLowerCase() },
  analysis_history: { type: String, format: ( s ) => s.trim().toLowerCase() },
  specimen_location: { type: String, format: ( s ) => s.trim().toLowerCase() },
  documents: { type: [ [ { type: String, format: ( s ) => s.trim().toLowerCase() } ] ] }
};
