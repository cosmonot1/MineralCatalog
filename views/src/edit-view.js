import React from 'react';
import SpeciesAdder from './species-adder.js';
import ExhibitAdder from './exhibit-adder.js';
import FormerOwnerAdder from './former-owner-adder.js';
import {
  cleanMineral, GCS_IMAGE_LINK, GCS_ANALYSIS_LINK, searchCriteria, GCS_LABEL_LINK,
  GCS_PROFESSIONAL_PHOTO_LINK, capitalize
} from './utils.js';

class EditView extends React.Component {
  constructor( props ) {
    super( props );

    let mineral;
    if ( props.spec ) {
      const additional = props.spec.species.additional;
      mineral = flatten( props.spec );
      mineral[ 'species.additional' ] = additional;
    } else {
      mineral = JSON.parse( JSON.stringify( cleanMineral ) )
    }

    if ( props.mode === 'duplicate' ) {
      mineral[ 'photos.main' ] = '';
      mineral[ 'photos.all' ] = [];
      mineral[ 'documents' ] = [];
    }

    this.state = Object.assign(
      {
        loading: false,
        uploading: false,
        photo_files: [],
        analysis_files: [],
        mode: props.mode
      },
      mineral
    );
  }

  reset() {
    if ( this.state.mode === 'duplicate' ) {
      this.setState( {
        loading: false,
        uploading: false,
        photo_files: [],
        analysis_files: [],
        'photos.main': '',
        'photos.all': [],
        documents: []
      } );
      this.photoFileInput.value = "";
      return this.analysisFileInput.value = "";
    }

    this.setState(
      Object.assign(
        {
          spec: null,
          loading: false,
          uploading: false,
          photo_files: [],
          analysis_files: []
        },
        JSON.parse( JSON.stringify( cleanMineral ) )
      )
    );

    this.photoFileInput.value = "";
    this.analysisFileInput.value = "";
    this.speciesAdder.reset();
  }

  checkDone() {
    if ( this.state.loading || this.state.uploading ) {
      return;
    }
  }

  add() {
    this.uploadPhotos( () => {
      this.uploadDocuments( () => {

        const done = ( err ) => {
          this.setState( { loading: false } );
          alert( err ? err.message : "Success!" );
          if ( !err ) {
            this.reset();
          }
        };

        this.setState( {
          'physical_dimensions.weight': parseFloat( this.state[ 'physical_dimensions.weight' ] || '0' ),
          'physical_dimensions.length': parseFloat( this.state[ 'physical_dimensions.length' ] || '0' ),
          'physical_dimensions.width': parseFloat( this.state[ 'physical_dimensions.width' ] || '0' ),
          'physical_dimensions.height': parseFloat( this.state[ 'physical_dimensions.height' ] || '0' ),
          'physical_dimensions.main_crystal': parseFloat( this.state[ 'physical_dimensions.main_crystal' ] || '0' ),
          'acquired.paid': parseFloat( this.state[ 'acquired.paid' ] || '0' ),
          'photos.main': this.state[ 'photos.all' ][ 0 ] || '',
          'species.additional': this.state[ 'species.additional' ].filter( s => s.species )
        }, () => {

          if ( this.state.mode !== 'edit' ) {
            return API.specimen.add( { specimen: this.state }, done );
          }

          API.specimen.update( { specimen: { _id: this.state._id }, set: this.state }, done );

        } );
      } );
    } );
  }

  handleChange( e ) {
    const t = e.target;
    this.setState( { [ t.name ]: t.type === 'file' ? t.files : ( t.type === 'checkbox' ? t.checked : t.value ) } );
  }

  goList() {
    this.reset();
    this.props.goList();
  }

  makePDF() {
    const w = 203.2, h = 127, margin = 4;
    const colW = ( w - 2 * margin ) / 3;
    const contentW = colW - 2 * margin;

    //docs https://rawgit.com/MrRio/jsPDF/master/docs/index.html
    //examples https://rawgit.com/MrRio/jsPDF/master/

    const doc = new jsPDF( {
      orientation: 'l',
      unit: 'mm',
      format: [ w, h ],
      lineHeight: 1
    } );

    if ( !this.state[ 'photos.main' ] ) {
      doc.text( 'No Image', 2 * margin, 3 * margin )
    } else {
      doc.addImage( GCS_IMAGE_LINK + this.state[ 'photos.main' ], '', 2 * margin, 2 * margin, contentW, contentW );
    }

    //TODO: put in catalog number
    doc.setFontSize( 12 )
      .text( this.buildPrintColumn( doc, 0, contentW ), 2 * margin, contentW + 4 * margin )
      .text( this.buildPrintColumn( doc, 1, contentW ), colW + 2 * margin, 3 * margin )
      .text( this.buildPrintColumn( doc, 2, contentW ), 2 * colW + 2 * margin, 3 * margin );

    doc.addPage( [ w, h ], 'l' );

    doc.save( ( "00000" + this.state.catalog_number ).substr( -5, 5 ) + '.pdf' );
  }

  buildPrintColumn( doc, col, width ) {
    return doc.splitTextToSize(
      searchCriteria
        .filter( c => c.print_col === col )
        .map( c => `${capitalize( c.name )}: ${checkFmtBool( c, this.state[ c.field ] )} ${c.unit ? `(${c.unit})` : ``}` )
        .join( '\n\n' )
      , width
    );

    function checkFmtBool( c, v ) {
      switch ( c.type ) {
        case 'boolean':
          return v ? 'Yes' : 'No';
        case 'date':
          return v.split( 'T' )[ 0 ];
        default:
          return v;
      }
    }
  };

  uploadPhotos( done ) {

    if ( this.state.loading ) {
      return;
    }

    this.setState( { loading: true } );

    upload.call( this, this.state.photo_files, 0 );

    function upload( files, i ) {
      if ( i >= files.length ) {
        return done();
      }

      const file = files[ i ];

      API.specimen.upload( { type: 'photo', 'content-type': file.type }, ( err, result ) => {
        if ( err ) {
          throw err;
        }

        const that = this;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if ( this.readyState != 4 ) {
            return;
          }

          if ( this.response.err ) {
            throw this.response.err;
          }

          that.setState( {
            'photos.all': [
              ...that.state[ 'photos.all' ],
              result.filename
            ]
          }, () => upload.call( that, files, ++i ) );

        };

        xhttp.open( "PUT", result.url, true );
        xhttp.setRequestHeader( 'Content-Type', file.type );
        xhttp.send( file );

      } );
    }

  }

  loadSpecies( species ) {
    this.setState( {
      'species.additional': species
    } );
  }

  uploadDocuments( done ) {
    upload.call( this, this.state.analysis_files, 0 );

    function upload( files, i ) {

      if ( i >= files.length ) {
        return done();
      }

      const file = files[ i ];

      API.specimen.upload( { type: 'analysis', 'content-type': file.type }, ( err, result ) => {
        if ( err ) {
          throw err;
        }

        const that = this;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if ( this.readyState != 4 ) {
            return;
          }

          if ( this.response.err ) {
            throw this.response.err;
          }

          that.setState( {
            'documents': [
              ...that.state[ 'documents' ],
              result.filename
            ]
          }, () => upload.call( that, files, ++i ) );

        };

        xhttp.open( "PUT", result.url, true );
        xhttp.setRequestHeader( 'Content-Type', file.type );
        xhttp.send( file );

      } );
    }
  }

  render() {
    return (
      <div id="test">

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Photos</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <input type="file" name="photo_files" onChange={this.handleChange.bind( this )}
                   ref={ref => this.photoFileInput = ref}
                   multiple/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            {this.state[ 'photos.all' ].map( photo => (
              <a key={photo} href={GCS_IMAGE_LINK + photo} target='_blank' style={{ marginRight: 8 }}>
                <img width="100" height="100" src={GCS_IMAGE_LINK + photo} alt={photo}/>
              </a>
            ) )}
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Physical Dimensions</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Weight (g)</div>
            <input type="text" name="physical_dimensions.weight" value={this.state[ 'physical_dimensions.weight' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Length (cm)</div>
            <input type="text" name="physical_dimensions.length" value={this.state[ 'physical_dimensions.length' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Width (cm)</div>
            <input type="text" name="physical_dimensions.width" value={this.state[ 'physical_dimensions.width' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Height (cm)</div>
            <input type="text" name="physical_dimensions.height" value={this.state[ 'physical_dimensions.height' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Main Crystal (cm)</div>
            <input type="text" name="physical_dimensions.main_crystal"
                   value={this.state[ 'physical_dimensions.main_crystal' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Species</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Main</div>
            <input type="text" name="species.main" value={this.state[ 'species.main' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <SpeciesAdder species={this.state[ 'species.additional' ] || []}
                          loadSpecies={this.loadSpecies.bind( this )}
                          ref={ref => this.speciesAdder = ref}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Discovery Location</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Stope</div>
            <input type="text" name="discovery_location.stope" value={this.state[ 'discovery_location.stope' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Level</div>
            <input type="text" name="discovery_location.level" value={this.state[ 'discovery_location.level' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Mine</div>
            <input type="text" name="discovery_location.mine" value={this.state[ 'discovery_location.mine' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>District</div>
            <input type="text" name="discovery_location.district" value={this.state[ 'discovery_location.district' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>State</div>
            <input type="text" name="discovery_location.state" value={this.state[ 'discovery_location.state' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Country</div>
            <input type="text" name="discovery_location.country" value={this.state[ 'discovery_location.country' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Analysis</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Analyzed</div>
            <input type="checkbox" name="analysis.analyzed" checked={this.state[ 'analysis.analyzed' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>By</div>
            <input type="text" name="analysis.by" value={this.state[ 'analysis.by' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Method</div>
            <input type="text" name="analysis.method" value={this.state[ 'analysis.method' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Analysis Files</div>
            <input type="file" name="analysis_files" onChange={this.handleChange.bind( this )}
                   ref={ref => this.analysisFileInput = ref}
                   multiple/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            {this.state[ 'documents' ].map( doc => <a key={doc} href={GCS_ANALYSIS_LINK + doc} target='_blank'
                                                      style={{ marginRight: 8 }}>{doc}</a> )}
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Acquired</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Date (YYYY-MM-DD ex: Sep 23 1994 = 1994-09-23)</div>
            <input type="text" name="acquired.date" value={this.state[ 'acquired.date' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Paid ($)</div>
            <input type="text" name="acquired.paid" value={this.state[ 'acquired.paid' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>From</div>
            <input type="text" name="acquired.from" value={this.state[ 'acquired.from' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Where</div>
            <input type="text" name="acquired.where" value={this.state[ 'acquired.where' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>States</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Old Label</div>
            <input type="checkbox" name="states.old_label" checked={this.state[ 'states.old_label' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Repair</div>
            <input type="checkbox" name="states.repair" checked={this.state[ 'states.repair' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Story</div>
            <input type="checkbox" name="states.story" checked={this.state[ 'states.story' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Figured</div>
            <input type="checkbox" name="states.figured" checked={this.state[ 'states.figured' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Storage Location</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Exhibit</div>
            <input type="checkbox" name="storage_location.exhibit" checked={this.state[ 'storage_location.exhibit' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Inside</div>
            <input type="checkbox" name="storage_location.inside" checked={this.state[ 'storage_location.inside' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Outside</div>
            <input type="checkbox" name="storage_location.outside" checked={this.state[ 'storage_location.outside' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Loan</div>
            <input type="checkbox" name="storage_location.loan" checked={this.state[ 'storage_location.loan' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Details</div>
            <input type="text" name="storage_location.details" value={this.state[ 'storage_location.details' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Other</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Comments</div>
            <input type="text" name="comments" value={this.state[ 'comments' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Story</div>
            <input type="text" name="story" value={this.state[ 'story' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Figured</div>
            <input type="text" name="figured" value={this.state[ 'figured' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Repair History</div>
            <input type="text" name="repair_history" value={this.state[ 'repair_history' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Analysis History</div>
            <input type="text" name="analysis_history" value={this.state[ 'analysis_history' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Specimen Location</div>
            <input type="text" name="specimen_location" value={this.state[ 'specimen_location' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <button style={{ 'marginRight': 8 }} type="button" onClick={this.goList.bind( this )}>Cancel</button>
        <button style={{ 'marginRight': 8 }} type="button"
                onClick={this.add.bind( this )}>{this.state.mode === 'edit' ? 'Update!' : 'Add!'}</button>
        {this.state.mode === 'edit' ?
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.makePDF.bind( this )}>Download</button> : ''}
      </div>
    );
  }
}

export default EditView;
