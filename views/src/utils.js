const cleanMineral = {
  'photos.main': '',
  'photos.all': [],
  'physical_dimensions.weight': 0,
  'physical_dimensions.length': 0,
  'physical_dimensions.width': 0,
  'physical_dimensions.height': 0,
  'physical_dimensions.main_crystal': 0,
  'species.main': '',
  'species.additional': [],
  'discovery_location.stope': '',
  'discovery_location.level': '',
  'discovery_location.mine': '',
  'discovery_location.district': '',
  'discovery_location.state': '',
  'discovery_location.country': '',
  'analysis.analyzed': false,
  'analysis.by': '',
  'analysis.method': '',
  'acquired.date': '',
  'acquired.paid': 0,
  'acquired.from': '',
  'acquired.where': '',
  'states.old_label': false,
  'states.repair': false,
  'states.story': false,
  'states.figured': false,
  'storage_location.exhibit': false,
  'storage_location.inside': false,
  'storage_location.outside': false,
  'storage_location.loan': false,
  'storage_location.details': '',
  comments: '',
  story: '',
  figured: '',
  repair_history: '',
  analysis_history: '',
  specimen_location: '',
  documents: []
};

const GCS_IMAGE_LINK = 'https://storage.googleapis.com/mineral-catalog-images/';

const GCS_ANALYSIS_LINK = 'https://storage.googleapis.com/mineral-catalog-analysis-documents/';

const searchCriteria = [
  { name: 'catalog number', type: 'number', field: 'catalog_number', print_col: 0 },
  { name: 'weight', type: 'number', field: 'physical_dimensions.weight', print_col: 0, unit: 'g' },
  { name: 'length', type: 'number', field: 'physical_dimensions.length', print_col: 0, unit: 'cm' },
  { name: 'width', type: 'number', field: 'physical_dimensions.width', print_col: 0, unit: 'cm' },
  { name: 'height', type: 'number', field: 'physical_dimensions.height', print_col: 0, unit: 'cm' },
  { name: 'main crystal', type: 'number', field: 'physical_dimensions.main_crystal', print_col: 0, unit: 'cm' },
  { name: 'main species', type: 'string', field: 'species.main', print_col: 1 },
  { name: 'additional species', type: 'string', field: 'species.additional.species', print_col: 1 },
  { name: 'stope', type: 'string', field: 'discovery_location.stope', print_col: 1 },
  { name: 'level', type: 'string', field: 'discovery_location.level', print_col: 1 },
  { name: 'mine', type: 'string', field: 'discovery_location.mine', print_col: 1 },
  { name: 'district', type: 'string', field: 'discovery_location.district', print_col: 1 },
  { name: 'state', type: 'string', field: 'discovery_location.state', print_col: 1 },
  { name: 'country', type: 'string', field: 'discovery_location.country', print_col: 1 },
  { name: 'analyzed', type: 'boolean', field: 'analysis.analyzed', print_col: 1 },
  { name: 'analyzed by', type: 'string', field: 'analysis.by', print_col: 1 },
  { name: 'analysis method', type: 'string', field: 'analysis.method', print_col: 1 },
  { name: 'acquired date', type: 'date', field: 'acquired.date', print_col: 2 },
  { name: 'paid', type: 'number', field: 'acquired.paid', print_col: 2, unit: '$' },
  { name: 'acquired from', type: 'string', field: 'acquired.from', print_col: 2 },
  { name: 'acquired where', type: 'string', field: 'acquired.where', print_col: 2 },
  { name: 'old label', type: 'boolean', field: 'states.old_label', print_col: 2 },
  { name: 'repair', type: 'boolean', field: 'states.repair', print_col: 2 },
  { name: 'story', type: 'boolean', field: 'states.story', print_col: 2 },
  { name: 'figured', type: 'boolean', field: 'states.figured', print_col: 2 },
  { name: 'exhibit', type: 'boolean', field: 'storage_location.exhibit', print_col: 2 },
  { name: 'inside', type: 'boolean', field: 'storage_location.inside', print_col: 2 },
  { name: 'outside', type: 'boolean', field: 'storage_location.outside', print_col: 2 },
  { name: 'loan', type: 'boolean', field: 'storage_location.loan', print_col: 2 },
  { name: 'storage details', type: 'string', field: 'storage_location.details' },
  { name: 'comments', type: 'string', field: 'comments' },
  { name: 'story', type: 'string', field: 'story' },
  { name: 'figured', type: 'string', field: 'figured' },
  { name: 'repair history', type: 'string', field: 'repair_history' },
  { name: 'analysis history', type: 'string', field: 'analysis_history' },
  { name: 'specimen location', type: 'string', field: 'specimen_location' },
  { name: 'date added', type: 'date', field: 'timestamps.created' },
  { name: 'date modified', type: 'date', field: 'timestamps.modified' }
];

const searchOperators = {
  number: [
    {
      operator: '$eq',
      name: 'equal to'
    },
    {
      operator: '$gt',
      name: 'greater than'
    },
    {
      operator: '$lt',
      name: 'less than'
    },
    {
      operator: '$ne',
      name: 'not equal to'
    }
  ],
  string: [
    {
      operator: '$eq',
      name: 'equal to'
    },
    {
      operator: '$ne',
      name: 'not equal to'
    },
    {
      operator: '$regex',
      name: 'contains'
    }
  ],
  date: [
    {
      operator: '$eq',
      name: 'equal to'
    },
    {
      operator: '$gt',
      name: 'greater than'
    },
    {
      operator: '$lt',
      name: 'less than'
    },
    {
      operator: '$ne',
      name: 'not equal to'
    }
  ],
  boolean: [
    {
      operator: '$eq',
      name: 'equal to'
    },
    {
      operator: '$ne',
      name: 'not equal to'
    }
  ]
};

const cleanSearchItem = {
  metric: 'physical_dimensions.weight',
  operator: '$gt',
  operatorType: 'number',
  value: '',
  checked: false
};

function preventDefault( e ) {
  e.preventDefault()
}

function capitalize( a ) {
  return a.charAt( 0 ).toUpperCase() + a.slice( 1 );
}

export {
  cleanMineral,
  GCS_IMAGE_LINK,
  GCS_ANALYSIS_LINK,
  searchCriteria,
  searchOperators,
  cleanSearchItem,
  preventDefault,
  capitalize
};
