const GCS_STORAGE_LINK = 'https://storage.googleapis.com/mineral-catalog-images/';

const cleanMineral = {
  'photos.main': '',
  'photos.all': [],
  'physical_dimensions.weight': 0,
  'physical_dimensions.length': 0,
  'physical_dimensions.width': 0,
  'physical_dimensions.height': 0,
  'physical_dimensions.main_crystal': 0,
  'species.main': '',
  'species.additional': '',
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
  specimen_location: ''
};

const searchCriteria = [
  { name: 'catalog number', type: 'number', field: 'catalog_number' },
  { name: 'weight', type: 'number', field: 'physical_dimensions.weight' },
  { name: 'length', type: 'number', field: 'physical_dimensions.length' },
  { name: 'width', type: 'number', field: 'physical_dimensions.width' },
  { name: 'height', type: 'number', field: 'physical_dimensions.height' },
  { name: 'main crystal', type: 'number', field: 'physical_dimensions.main_crystal' },
  { name: 'main species', type: 'string', field: 'species.main' },
  { name: 'additional species', type: 'string', field: 'species.additional' },
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
  { name: 'paid', type: 'number', field: 'acquired.paid' },
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

const preventDefault = ( e ) => {e.preventDefault()};

class Specimen extends React.Component {
  constructor( props ) {
    super( props );
  }

  edit() {
    this.props.edit( this.props.spec );
  }

  render() {
    return (
      <div>
        <table style={{ padding: 8, display: 'inline-block' }}>
          <tbody>
            <tr>
              <th>Main Photo</th>
            </tr>
            <tr>
              <td>
                <div style={{ height: 100, width: 100 }}>
                  <img src={GCS_STORAGE_LINK + this.props.spec.photos.main}
                       alt={this.props.spec.photos.main}
                       height="100"
                       width="100"/>
                </div>
              </td>
            </tr>
            <tr>
              <td>Catalog: {this.props.spec.catalog_number}</td>
            </tr>
            <tr>
              <td>
                <button type="button" onClick={this.edit.bind( this )}>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{ padding: 8, display: 'inline-block' }}>
          <tbody>
            <tr>
              <th style={{ 'paddingRight': 8 }}>Physical Dimensions</th>
              <th style={{ 'paddingRight': 8 }}>Species</th>
              <th style={{ 'paddingRight': 8 }}>Discovery Location</th>
              <th style={{ 'paddingRight': 8 }}>Analysis</th>
              <th style={{ 'paddingRight': 8 }}>Acquired</th>
              <th style={{ 'paddingRight': 8 }}>States</th>
              <th style={{ 'paddingRight': 8 }}>Storage Location</th>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Weight: {this.props.spec.physical_dimensions.weight} (g)</td>
              <td style={{ 'paddingRight': 8 }}>Main: {this.props.spec.species.main}</td>
              <td style={{ 'paddingRight': 8 }}>Stope: {this.props.spec.discovery_location.stope}</td>
              <td style={{ 'paddingRight': 8 }}>Analyzed: <input type="checkbox" name="checked"
                                                                 readOnly
                                                                 checked={this.props.spec.analysis.analyzed}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Date: {this.props.spec.acquired.date}</td>
              <td style={{ 'paddingRight': 8 }}>Old Label: <input type="checkbox" name="checked"
                                                                  readOnly
                                                                  checked={this.props.spec.states.old_label}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Exhibit: <input type="checkbox" name="checked"
                                                                readOnly
                                                                checked={this.props.spec.storage_location.exhibit}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Length: {this.props.spec.physical_dimensions.length} (cm)</td>
              <td
                style={{ 'paddingRight': 8 }}>Additional: {this.props.spec.species.additional.reduce( ( acc, val ) => acc + ' ' + val, '' )}</td>
              <td style={{ 'paddingRight': 8 }}>Level: {this.props.spec.discovery_location.level}</td>
              <td style={{ 'paddingRight': 8 }}>By: {this.props.spec.analysis.by}</td>
              <td style={{ 'paddingRight': 8 }}>Paid: {this.props.spec.acquired.paid} ($)</td>
              <td style={{ 'paddingRight': 8 }}>Repair: <input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.states.repair}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Inside: <input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.storage_location.inside}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Width: {this.props.spec.physical_dimensions.width} (cm)</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Mine: {this.props.spec.discovery_location.mine}</td>
              <td style={{ 'paddingRight': 8 }}>Method: {this.props.spec.analysis.method}</td>
              <td style={{ 'paddingRight': 8 }}>From: {this.props.spec.acquired.from}</td>
              <td style={{ 'paddingRight': 8 }}>Story: <input type="checkbox" name="checked"
                                                              readOnly
                                                              checked={this.props.spec.states.story}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Outside:<input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.storage_location.outside}/></td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Height: {this.props.spec.physical_dimensions.height} (cm)</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>District: {this.props.spec.discovery_location.district}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Where: {this.props.spec.acquired.where}</td>
              <td style={{ 'paddingRight': 8 }}>Figured: <input type="checkbox" name="checked"
                                                                readOnly
                                                                checked={this.props.spec.states.figured}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Loan: <input type="checkbox" name="checked"
                                                             readOnly
                                                             checked={this.props.spec.storage_location.loan}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Main Crystal: {this.props.spec.physical_dimensions.main_crystal} (cm)
              </td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>State: {this.props.spec.discovery_location.state}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Details: {this.props.spec.storage_location.details}</td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Country: {this.props.spec.discovery_location.country}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class SearchItem extends React.Component {
  constructor( props ) {
    super( props );
    this.state = cleanSearchItem;
  }

  handleChange( e ) {
    const state = { [ e.target.name ]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    if ( e.target.name === 'metric' ) {
      state.operatorType = ( searchCriteria.find( sc => sc.field === e.target.value ) || { type: 'numeric' } ).type;
      state.operator = searchOperators[ state.operatorType ][ 0 ].operator;
    }

    this.setState( state, () => {
      this.props.getState( this.props.specialKey, this.state );
    } );
  }

  decideInput( type ) {
    if ( type === 'boolean' ) {
      return <input type="checkbox" name="checked" checked={this.state.checked}
                    onChange={this.handleChange.bind( this )}/>
    }
    return <input type="text" name="value" value={this.state.value}
                  onChange={this.handleChange.bind( this )}/>
  }

  render() {
    return (
      <div style={{ paddingRight: 8, paddingBottom: 8, display: 'inline-block' }}>
        <div style={{ paddingBottom: 8 }}>
          <select name="metric" value={this.state.metric} onChange={this.handleChange.bind( this )}>
            {searchCriteria.map( c => <option key={uuidv4()} value={c.field}>{c.name}</option> )}
          </select>
        </div>
        <div style={{ paddingBottom: 8 }}>
          <select name="operator" value={this.state.operator} onChange={this.handleChange.bind( this )}>
            {searchOperators[ this.state.operatorType ].map( c => <option key={uuidv4()}
                                                                          value={c.operator}>{c.name}</option> )}
          </select>
        </div>
        <div>
          {this.decideInput( this.state.operatorType )}
        </div>
      </div>
    );
  }
}

class SearchCriteria extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      searchCriteria: [],
      keys: []
    };
  }

  search() {
    const query = [];
    this.state.keys.forEach( k => {
      const state = this.state[ k ];
      if ( state.operatorType === 'number' ) {
        state.value = parseInt( state.value, 10 );
      }
      query.push( {
        [ state.metric ]: {
          [ state.operator ]: state.operatorType === 'boolean' ? state.checked : state.value
        }
      } );
    } );

    this.props.search( { $and: query } );
  }

  getState( key, state ) {
    this.setState( { [ key ]: state } );
  }

  add() {
    const key = uuidv4();
    this.setState( {
      searchCriteria: [ ...this.state.searchCriteria,
        <SearchItem specialKey={key} key={key} getState={this.getState.bind( this )}/> ],
      keys: [ ...this.state.keys, key ],
      [ key ]: cleanSearchItem
    } );
  }

  // remove( key ) {
  //   //TODO: verify that this works (key === e.key)
  //   //TODO: remove key from state tracking
  //   //TODO: remove key from keys array
  //   const idx = this.state.searchCriteria.findIndex( e => {
  //     console.log( e );
  //     return key === e.key;
  //   } );
  //
  //   if ( idx === -1 ) {
  //     return console.warn( 'Unable to find search criteria item for removal.' );
  //   }
  //
  //   this.setState( {
  //     searchCriteria: [
  //       ...this.state.searchCriteria.slice( 0, idx ),
  //       ...this.state.searchCriteria.slice( idx + 1 )
  //     ],
  //     [ e.key ]: undefined//TODO: make sure this works
  //   } );
  //
  // }

  reset() {
    const state = {};
    this.state.keys.forEach( k => state[ k ] = undefined );
    this.setState( Object.assign( state, { searchCriteria: [], keys: [] } ), () => {
      this.search( {} )
    } );
  }

  render() {
    return (
      <div style={{ padding: 8 }}>
        <div>
          {this.state.searchCriteria}
        </div>
        <div>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.search.bind( this )}>Search</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.reset.bind( this )}>Reset</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.add.bind( this )}>Add</button>
        </div>
      </div>
    );
  }

}

class Home extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { view: 'list', spec: null }
  }

  logout() {
    this.props.changeView( 'login' );
    this.state = { view: 'list' };
    API.user.logout( {}, ( err ) => {
      if ( err ) {
        alert( 'Logout failed' );
      }
    } );
  }

  edit() {
    this.goEdit( null );
  }

  goEdit( spec ) {
    this.setState( { view: 'edit', spec: spec || null } );
  }

  goList() {
    this.setState( { view: 'list', selected: '' } );
  }

  render() {
    return (
      <div>
        <div style={{ padding: 8 }}>
          {this.state.view === 'edit' ? '' :
            <button style={{ 'marginRight': 8 }} type="button" onClick={this.edit.bind( this )}>Add</button>}
          <button type="button" onClick={this.logout.bind( this )}>Logout</button>
        </div>
        <div>{this.state.view === 'list' ? <ListView goEdit={this.goEdit.bind( this )}/> :
          <EditView goList={this.goList.bind( this )} spec={this.state.spec}/>}</div>
      </div>
    );
  }
}

class EditView extends React.Component {
  constructor( props ) {
    super( props );

    let mineral;
    if ( props.spec ) {
      props.spec.species.additional = props.spec.species.additional.join( ' ' );
      mineral = flatten( props.spec );
    } else {
      mineral = JSON.parse( JSON.stringify( cleanMineral ) )
    }

    this.state = Object.assign(
      {
        spec: !!props.spec,
        loading: false,
        uploading: false,
        files: []
      },
      mineral
    );
  }

  reset() {
    this.setState(
      Object.assign(
        {
          spec: null,
          loading: false,
          uploading: false,
          files: []
        },
        JSON.parse( JSON.stringify( cleanMineral ) )
      )
    );

    this.fileInput.value = "";

  }

  checkDone() {
    if ( this.state.loading || this.state.uploading ) {
      return;
    }
  }

  add() {
    this.uploadPhotos( () => {
      const done = ( err ) => {
        this.setState( { loading: false } );
        alert( err ? err.message : "Success!" );
        if ( !err ) {
          this.reset();
        }
      };

      this.setState( {
        'physical_dimensions.weight': parseInt( this.state[ 'physical_dimensions.weight' ] || '0' ),
        'physical_dimensions.length': parseInt( this.state[ 'physical_dimensions.length' ] || '0' ),
        'physical_dimensions.width': parseInt( this.state[ 'physical_dimensions.width' ] || '0' ),
        'physical_dimensions.height': parseInt( this.state[ 'physical_dimensions.height' ] || '0' ),
        'physical_dimensions.main_crystal': parseInt( this.state[ 'physical_dimensions.main_crystal' ] || '0' ),
        'acquired.paid': parseInt( this.state[ 'acquired.paid' ] || '0' ),
        'photos.main': this.state[ 'photos.all' ][ 0 ] || ''
      }, () => {

        if ( !this.state.spec ) {
          return API.specimen.add( { specimen: this.state }, done );
        }

        API.specimen.update( { specimen: { _id: this.state._id }, set: this.state }, done );

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
    //docs https://rawgit.com/MrRio/jsPDF/master/docs/index.html
    //examples https://rawgit.com/MrRio/jsPDF/master/
    const doc = new jsPDF();
    const test = document.getElementById( 'test' );
    console.log( 'test',test );
    doc.text( `Specimen ${this.state.catalog_number}`, 20, 20 );
    doc.fromHTML( test, 50, 50, {
      'width': 500,
      'elementHandlers': {
        button: () => true
      }
    } );
    doc.save( 'a4.pdf' );
  }

  uploadPhotos( done ) {

    if ( this.state.loading ) {
      return;
    }

    this.setState( { loading: true } );

    upload.call( this, this.state.files, 0 );

    function upload( files, i ) {
      if ( i >= files.length ) {
        return done();
      }

      const file = files[ i ];

      API.specimen.photo.upload( { 'content-type': file.type }, ( err, result ) => {
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

  render() {
    return (
      <div id="test">

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Photos</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <input type="file" name="files" onChange={this.handleChange.bind( this )} ref={ref => this.fileInput = ref}
                   multiple/>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            {this.state[ 'photos.all' ].map( photo => <img width="100" height="100" src={GCS_STORAGE_LINK + photo}
                                                           alt={photo} key={photo} style={{ marginRight: 8 }}/> )}
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
            <div>Additional</div>
            <input type="text" name="species.additional" value={this.state[ 'species.additional' ]}
                   onChange={this.handleChange.bind( this )}/>
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
        </div>

        <div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <strong>Acquired</strong>
          </div>
          <div style={{ 'paddingRight': 8, 'paddingBottom': 8, display: 'inline-block' }}>
            <div>Date (DD-MM-YYYY ex: 09-23-1994)</div>
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
                onClick={this.add.bind( this )}>{this.state.spec ? 'Update!' : 'Add!'}</button>
        {this.state.spec ?
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.makePDF.bind( this )}>Download</button> : ''}
      </div>
    );
  }
}

class ListView extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      loading: true,
      specimens: [],
      page: 0,
      pages: 0,
      limit: 10
    };
    this.__search( {} );
  }

  search( query ) {
    if ( this.state.loading ) {
      return;
    }
    this.setState( { loading: true } );
    this.__search( query );
  }

  __search( query ) {
    API.specimen.list( {
      limit: this.state.limit,
      offset: this.state.page * this.state.limit,
      specimen: query
    }, ( err, result ) => {
      this.setState( { loading: false } );

      if ( err ) {
        return alert( err.message );
      }

      this.setState( {
        specimens: result.specimens.map( s => <Specimen key={s._id} spec={s} edit={this.edit.bind( this )}/> ),
        page: Math.floor( result.offset / result.limit ),
        pages: Math.floor( result.total / result.limit )
      } );
    } );
  }

  edit( spec ) {
    this.props.goEdit( spec );
  }

  first() {
    this.setState( { page: 0 } );
    setTimeout( this.search.bind( this ), 0 );
  }

  last() {
    this.setState( { page: this.state.pages } );
    setTimeout( this.search.bind( this ), 0 );
  }

  next() {
    if ( this.state.page < this.state.pages ) {
      this.setState( { page: this.state.page + 1 } );
      setTimeout( this.search.bind( this ), 0 );
    }
  }

  previous() {
    if ( this.state.page > 0 ) {
      this.setState( { page: this.state.page - 1 } );
      setTimeout( this.search.bind( this ), 0 );
    }
  }

  render() {
    return (
      <div>
        <SearchCriteria search={this.search.bind( this )}/>
        <div style={{ padding: 8 }}>
          {this.state.specimens}
        </div>
        <div style={{ padding: 8 }}>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.first.bind( this )}>&lt;&lt;</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.previous.bind( this )}>&lt;</button>
          <span style={{ 'marginRight': 8 }}>{this.state.page + 1} of {this.state.pages + 1}</span>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.next.bind( this )}>&gt;</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.last.bind( this )}>&gt;&gt;</button>
          <a target="_blank" href="/api/v0/specimen/download/json">
            <button style={{ 'marginRight': 8 }} type="button">Download JSON</button>
          </a>
          <a target="_blank" href="/api/v0/specimen/download/csv">
            <button type="button">Download CSV</button>
          </a>
        </div>
      </div>
    );
  }
}

class LoginView extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { password: '' };
  }

  handleChange( e ) {
    this.setState( { password: e.target.value } );
  }

  login() {
    const pw = this.state.password;
    this.setState( { password: '' } );

    //If successful change state
    API.user.authorize( { password: pw }, ( err ) => {
      if ( err ) {
        return alert( 'Incorrect password!' );
      }
      this.props.changeView( 'home' );
    } );
  }

  render() {
    return (
      <div>
        <input style={{ 'marginRight': 8 }} type="text" name="Password" value={this.state.password}
               onChange={this.handleChange.bind( this )}/>
        <button type="button" onClick={this.login.bind( this )}>Login</button>
      </div>
    )
  }
}

class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { view: 'login' };
    this.changeView = this.changeView.bind( this );
  }

  changeView( view ) {
    this.setState( { view } )
  }

  render() {
    return (
      <div>
        <h1 style={{ padding: 8 }}>Mineral Catalog</h1>
        <div>{this.state.view === 'login' ? <LoginView changeView={this.changeView}/> :
          <Home changeView={this.changeView}/>}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById( 'root' )
);

//TODO: IMAGE Size and aspect ratio maintaining http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
