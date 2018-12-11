'use strict';

module.exports = {};

module.exports.default_projection_field = {
  type: Object,
  default: {}
};

//TODO: Lower case formatting for all string in puts that aren't "other" type.

module.exports.specimen_add_ref = {
  photos: {
    type: {
      main_photo: { type: String, default: '' },
      all: { type: [ [ { type: String } ] ], default: [] },
    },
    required: true
  },
  physical_dimensions: {
    type: {
      weight: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      main_crystal: { type: Number, default: 0 },
    },
    required: true
  },
  species: {
    type: {
      main: { type: String, default: '' },
      additional: { type: [ [ { type: String } ] ], default: [] },
    },
    required: true
  },
  discovery_location: {
    type: {
      stope: { type: String },
      level: { type: String },
      mine: { type: String },
      district: { type: String },
      state: { type: String },
      country: { type: String }
    },
    required: true
  },
  analysis: {
    type: {
      analyzed: { type: Boolean, default: false },
      by: { type: String, default: '' },
      method: { type: String, default: '' }
    },
    required: true
  },
  acquired: {
    type: {
      date: { format: 'date', default: '' },
      paid: { type: Number, default: 0 },
      from: { type: String, default: '' },
      where: { type: String, default: '' }
    },
    required: true
  },
  states: {
    type: {
      old_label: { type: Boolean, default: false },
      repair: { type: Boolean, default: false },
      story: { type: Boolean, default: false },
      figured: { type: Boolean, default: false }
    },
    required: true
  },
  storage_location: {
    type: {
      exhibit: { type: Boolean, deafult: false },
      inside: { type: Boolean, deafult: false },
      outside: { type: Boolean, deafult: false },
      loan: { type: Boolean, deafult: false },
      details: { type: String, default: '' }
    },
    required: true
  },
  comments: { type: String, default: '' },
  story: { type: String, default: '' },
  figured: { type: String, default: '' },
  repair_history: { type: String, default: '' },
  analysis_history: { type: String, default: '' },
  specimen_location: { type: String, default: '' },
};

module.exports.specimen_get_ref = {
  $anyOf: [
    {
      _id: { type: String, required: true },
    },
    {
      catalog_number: { type: String, required: true }
    }
  ]
};

// TODO: Searching text fields
module.exports.specimen_list_ref = {
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
      main: { type: String },
      additional: { type: String },
    },
    flatten: true
  },
  discovery_location: {
    type: {
      stope: { type: String },
      level: { type: String },
      mine: { type: String },
      district: { type: String },
      state: { type: String },
      country: { type: String }
    },
    flatten: true
  },
  analysis: {
    type: {
      analyzed: { type: Boolean },
      by: { type: String },
      method: { type: String }
    },
    flatten: true
  },
  acquired: {
    type: {
      date: { format: 'date' },
      paid: { type: Number },
      from: { type: String },
      where: { type: String }
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
      details: { type: String }
    },
    flatten: true
  },
  comments: { type: String },
  story: { type: String },
  figured: { type: String },
  repair_history: { type: String },
  analysis_history: { type: String },
  specimen_location: { type: String },
  timestamps: {
    type: {
      created: { format: 'date' },
      updated: { format: 'date' }
    },
    flatten: true
  }
};

// Don't allow change of catalog number
module.exports.specimen_update_data = module.exports.specimen_list_ref;
