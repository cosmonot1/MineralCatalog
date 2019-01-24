import React from 'react';

const GCS_IMAGE_LINK = 'https://storage.googleapis.com/mineral-catalog-images/';
const GCS_ANALYSIS_LINK = 'https://storage.googleapis.com/mineral-catalog-analysis-documents/';
const GCS_LABEL_LINK = 'https://storage.googleapis.com/mineral-catalog-labels/';
const GCS_PROFESSIONAL_PHOTO_LINK = 'https://storage.googleapis.com/mineral-catalog-professional-photos/';

const cleanMineral = {
  'photos.main': '',
  'photos.all': [],
  'physical_dimensions.weight': '',
  'physical_dimensions.length': '',
  'physical_dimensions.width': '',
  'physical_dimensions.height': '',
  'physical_dimensions.main_crystal': '',
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
  'acquired.paid': '',
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
  documents: [],
  'exhibit_history': [],
  'geology.metamorphic': false,
  'geology.pegmatite': false,
  'geology.porphyry': false,
  'geology.crd_skarn': false,
  'geology.epithermal_vein': false,
  'geology.volcanic_related': false,
  'geology.exhalite': false,
  'geology.mvt': false,
  'geology.evaporite': false,
  'geology.other': '',
  'features.twinned': false,
  'features.pseudomorph': false,
  'features.inclusions': false,
  'features.photosensitive': false,
  'fluorescence.sw': false,
  'fluorescence.sw_details': '',
  'fluorescence.lw': false,
  'fluorescence.lw_details': '',
  'quality.exceptional': false,
  'quality.exhibit': false,
  'quality.locality': false,
  'quality.study': false,
  'locality.type_locality': false,
  'locality.self_collected': false,
  'locality.when': '',
  'photographed.photographed': false,
  'photographed.by': '',
  'photographed.photo_file_number': '',
  'photographed.files': [],
  'provenance.old_labels': false,
  'provenance.prior_labels': false,
  'provenance.former_owners': [],
  'provenance.prior_catalog_number': '',
  'provenance.label': false,
  'provenance.label_files': [],
  'provenance.miguel_romero': false,
  'provenance.miguel_romero_number': '',

};

const searchCriteria = [
  { name: 'catalog number', type: 'number', field: 'catalog_number' },
  { name: 'weight', type: 'number', field: 'physical_dimensions.weight', unit: 'g' },
  { name: 'length', type: 'number', field: 'physical_dimensions.length', unit: 'cm' },
  { name: 'width', type: 'number', field: 'physical_dimensions.width', unit: 'cm' },
  { name: 'height', type: 'number', field: 'physical_dimensions.height', unit: 'cm' },
  { name: 'main crystal', type: 'number', field: 'physical_dimensions.main_crystal', unit: 'cm' },
  { name: 'main species', type: 'string', field: 'species.main' },
  { name: 'additional species', type: 'string', field: 'species.additional.species' },
  { name: 'stope', type: 'string', field: 'discovery_location.stope' },
  { name: 'level', type: 'string', field: 'discovery_location.level' },
  { name: 'mine', type: 'string', field: 'discovery_location.mine' },
  { name: 'district', type: 'string', field: 'discovery_location.district' },
  { name: 'state', type: 'string', field: 'discovery_location.state' },
  { name: 'country', type: 'string', field: 'discovery_location.country' },
  { name: 'analyzed', type: 'boolean', field: 'analysis.analyzed' },
  { name: 'analyzed by', type: 'string', field: 'analysis.by' },
  { name: 'analysis method', type: 'string', field: 'analysis.method' },
  { name: 'acquired date', type: 'date', field: 'acquired.date' },
  { name: 'paid', type: 'number', field: 'acquired.paid', unit: '$' },
  { name: 'acquired from', type: 'string', field: 'acquired.from' },
  { name: 'acquired where', type: 'string', field: 'acquired.where' },
  { name: 'old label', type: 'boolean', field: 'states.old_label' },
  { name: 'repair', type: 'boolean', field: 'states.repair' },
  { name: 'story', type: 'boolean', field: 'states.story' },
  { name: 'figured', type: 'boolean', field: 'states.figured' },
  { name: 'exhibit', type: 'boolean', field: 'storage_location.exhibit' },
  { name: 'inside', type: 'boolean', field: 'storage_location.inside' },
  { name: 'outside', type: 'boolean', field: 'storage_location.outside' },
  { name: 'loan', type: 'boolean', field: 'storage_location.loan' },
  { name: 'storage details', type: 'string', field: 'storage_location.details' },
  { name: 'comments', type: 'string', field: 'comments' },
  { name: 'story', type: 'string', field: 'story' },
  { name: 'figured', type: 'string', field: 'figured' },
  { name: 'repair history', type: 'string', field: 'repair_history' },
  { name: 'analysis history', type: 'string', field: 'analysis_history' },
  { name: 'specimen location', type: 'string', field: 'specimen_location' },
  { name: 'date added', type: 'date', field: 'timestamps.created' },
  { name: 'date modified', type: 'date', field: 'timestamps.modified' },
  { name: 'exhibit show', field: 'exhibit_history.show', type: 'string' },
  { name: 'exhibit year', field: 'exhibit_history.year', type: 'number' },
  { name: 'exhibit competition', field: 'exhibit_history.comp', type: 'string' },
  { name: 'exhibit award', field: 'exhibit_history.award', type: 'string' },
  { name: 'geology metamorphic', field: 'geology.metamorphic', type: 'boolean' },
  { name: 'geology pegamite', field: 'geology.pegmatite', type: 'boolean' },
  { name: 'geology porphyry', field: 'geology.porphyry', type: 'boolean' },
  { name: 'geology crd skarn', field: 'geology.crd_skarn', type: 'boolean' },
  { name: 'geology epithermal', field: 'geology.epithermal_vein', type: 'boolean' },
  { name: 'geology volcanic', field: 'geology.volcanic_related', type: 'boolean' },
  { name: 'geology exhalite', field: 'geology.exhalite', type: 'boolean' },
  { name: 'geology mvt', field: 'geology.mvt', type: 'boolean' },
  { name: 'geology evaporite', field: 'geology.evaporite', type: 'boolean' },
  { name: 'geology other', field: 'geology.other', type: 'string' },
  { name: 'twinned', field: 'features.twinned', type: 'boolean' },
  { name: 'pseudomorph', field: 'features.pseudomorph', type: 'boolean' },
  { name: 'inclusions', field: 'features.inclusions', type: 'boolean' },
  { name: 'photosensitive', field: 'features.photosensitive', type: 'boolean' },
  { name: 'fluorescence sw', field: 'fluorescence.sw', type: 'boolean' },
  { name: 'fluorescence sw details', field: 'fluorescence.sw_details', type: 'string' },
  { name: 'fluorescence lw', field: 'fluorescence.lw', type: 'boolean' },
  { name: 'fluorescence lw details', field: 'fluorescence.lw_details', type: 'string' },
  { name: 'quality exceptional', field: 'quality.exceptional', type: 'boolean' },
  { name: 'quality exhibit', field: 'quality.exhibit', type: 'boolean' },
  { name: 'quality locality', field: 'quality.locality', type: 'boolean' },
  { name: 'quality study', field: 'quality.study', type: 'boolean' },
  { name: 'type locality', field: 'locality.type_locality', type: 'boolean' },
  { name: 'self collected', field: 'locality.self_collected', type: 'boolean' },
  { name: 'self collected when', field: 'locality.when', type: 'date' },
  { name: 'photographed', field: 'photographed.photographed', type: 'boolean' },
  { name: 'photographed by', field: 'photographed.by', type: 'string' },
  { name: 'photo file number', field: 'photographed.photo_file_number', type: 'string' },
  { name: 'old labels', field: 'provenance.old_labels', type: 'boolean' },
  { name: 'prior labels', field: 'provenance.prior_labels', type: 'boolean' },
  { name: 'former owner', field: 'provenance.former_owners.owner', type: 'string' },
  { name: 'former owner year acquired', field: 'provenance.former_owners.year_acquired', type: 'number' },
  { name: 'prior catalog number', field: 'provenance.prior_catalog_number', type: 'number' },
  { name: 'label', field: 'provenance.label', type: 'boolean' },
  { name: 'miguel romero', field: 'provenance.miguel_romero', type: 'boolean' },
  { name: 'miguel romero number', field: 'provenance.miguel_romero_number', type: 'number' }
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

const linkColumns = [
  // {display_name:'', link:'photos.main'},
  // {'photos.all': []},
  { display_name: 'Weight', link: 'physical_dimensions.weight' },
  { display_name: 'Length', link: 'physical_dimensions.length' },
  { display_name: 'Width', link: 'physical_dimensions.width' },
  { display_name: 'Height', link: 'physical_dimensions.height' },
  { display_name: 'Main Crystal', link: 'physical_dimensions.main_crystal' },
  { display_name: 'Species', link: 'species.main' },
  { display_name: 'Species Mod', link: 'species.additional.*.modifier', type: 'array' },
  { display_name: 'Additional Species', link: 'species.additional.*.species', type: 'array' },
  { display_name: 'Stope', link: 'discovery_location.stope' },
  { display_name: 'Level', link: 'discovery_location.level' },
  { display_name: 'Mine', link: 'discovery_location.mine' },
  { display_name: 'District', link: 'discovery_location.district' },
  { display_name: 'State', link: 'discovery_location.state' },
  { display_name: 'Country', link: 'discovery_location.country' },
  { display_name: 'Analyzed', link: 'analysis.analyzed' },
  { display_name: 'Analyzed By', link: 'analysis.by' },
  { display_name: 'Analysis Method', link: 'analysis.method' },
  { display_name: 'Date Acquired', link: 'acquired.date' },
  { display_name: 'Paid', link: 'acquired.paid' },
  { display_name: 'Acquired From', link: 'acquired.from' },
  { display_name: 'Acquired Where', link: 'acquired.where' },
  { display_name: 'Old Label', link: 'states.old_label' },
  { display_name: 'Repair', link: 'states.repair' },
  { display_name: 'Story', link: 'states.story' },
  { display_name: 'Figured', link: 'states.figured' },
  { display_name: 'Storage Location Exhibit', link: 'storage_location.exhibit' },
  { display_name: 'Storage Location Inside', link: 'storage_location.inside' },
  { display_name: 'Storage Location Outside', link: 'storage_location.outside' },
  { display_name: 'Storage Location Loan', link: 'storage_location.loan' },
  { display_name: 'Storage Location Details', link: 'storage_location.details' },
  { display_name: 'Comments', link: 'comments' },
  { display_name: 'Story', link: 'story' },
  { display_name: 'Figured', link: 'figured' },
  { display_name: 'Repair History', link: 'repair_history' },
  { display_name: 'Analysis History', link: 'analysis_history' },
  { display_name: 'Specimen Location', link: 'specimen_location' },
  // { display_name: 'Documents', link: 'documents' },
  { display_name: 'Exhibit History', link: 'exhibit_history' },
  { display_name: 'Geology', link: 'geology.metamorphic' },
  { display_name: '', link: 'geology.pegmatite' },
  { display_name: '', link: 'geology.porphyry' },
  { display_name: '', link: 'geology.crd_skarn' },
  { display_name: '', link: 'geology.epithermal_vein' },
  { display_name: '', link: 'geology.volcanic_related' },
  { display_name: '', link: 'geology.exhalite' },
  { display_name: '', link: 'geology.mvt' },
  { display_name: '', link: 'geology.evaporite' },
  { display_name: '', link: 'geology.other' },
  { display_name: '', link: 'features.twinned' },
  { display_name: '', link: 'features.pseudomorph' },
  { display_name: '', link: 'features.inclusions' },
  { display_name: '', link: 'features.photosensitive' },
  { display_name: '', link: 'fluorescence.sw' },
  { display_name: '', link: 'fluorescence.sw_details' },
  { display_name: '', link: 'fluorescence.lw' },
  { display_name: '', link: 'fluorescence.lw_details' },
  { display_name: '', link: 'quality.exceptional' },
  { display_name: '', link: 'quality.exhibit' },
  { display_name: '', link: 'quality.locality' },
  { display_name: '', link: 'quality.study' },
  { display_name: '', link: 'locality.type_locality' },
  { display_name: '', link: 'locality.self_collected' },
  { display_name: '', link: 'locality.when' },
  { display_name: '', link: 'photographed.photographed' },
  { display_name: '', link: 'photographed.by' },
  { display_name: '', link: 'photographed.photo_file_number'
:
},
{
  display_name:'', link
:
  'photographed.files'
}
,
{
  display_name:'', link
:
  'provenance.old_labels'
}
,
{
  display_name:'', link
:
  'provenance.prior_labels'
}
,
{
  display_name:'', link
:
  'provenance.former_owners'
}
,
{
  display_name:'', link
:
  'provenance.prior_catalog_number'
}
,
{
  display_name:'', link
:
  'provenance.label'
}
,
{
  display_name:'', link
:
  'provenance.label_files'
}
,
{
  display_name:'', link
:
  'provenance.miguel_romero'
}
,
{
  display_name:'', link
:
  'provenance.miguel_romero_number'
}
]
;

function preventDefault ( e ) {
  e.preventDefault()
}

function capitalize ( a ) {
  return a.charAt( 0 ).toUpperCase() + a.slice( 1 );
}

function checkNumber ( n ) {
  n = parseFloat( n );
  return isNaN( n ) ? null : n;
}

export {
  cleanMineral,
  GCS_IMAGE_LINK,
  GCS_LABEL_LINK,
  GCS_ANALYSIS_LINK,
  GCS_PROFESSIONAL_PHOTO_LINK,
  searchCriteria,
  searchOperators,
  cleanSearchItem,
  preventDefault,
  capitalize,
  checkNumber,
  Modal,
  linkColumns
};

const Modal = ( { handleClose, show, children } ) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        {children}
        <button onClick={handleClose}> Close</button>
      </section>
    </div>
  );
};

/* Modal use example
<Modal show={this.state.show} handleClose={this.hideModal} >
  <p>Modal</p>
  <p>Data</p>
</Modal>
 */
