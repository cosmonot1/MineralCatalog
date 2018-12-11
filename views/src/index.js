const cleanMineral = {
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

class Specimen extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div>
        <div style={{ padding: 8, display: 'inline-block' }}>
          <div>Catalog: {this.props.spec.catalog_number}</div>
          <div>Main Photo</div>
          <button>Edit</button>
        </div>
        <table style={{ padding: 8, display: 'inline-block' }}>
          <tr>
            <th style={{ 'padding-right': 8 }}>Physical Dimensions</th>
            <th style={{ 'padding-right': 8 }}>Species</th>
            <th style={{ 'padding-right': 8 }}>Discovery Location</th>
            <th style={{ 'padding-right': 8 }}>Analysis</th>
            <th style={{ 'padding-right': 8 }}>Acquired</th>
            <th style={{ 'padding-right': 8 }}>States</th>
            <th style={{ 'padding-right': 8 }}>Storage Location</th>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}>Weight: {this.props.spec.physical_dimensions.weight} (g)</td>
            <td style={{ 'padding-right': 8 }}>Main: {this.props.spec.species.main}</td>
            <td style={{ 'padding-right': 8 }}>Stope: {this.props.spec.discovery_location.stope}</td>
            <td style={{ 'padding-right': 8 }}>Analyzed: {this.props.spec.analysis.analyzed}</td>
            <td style={{ 'padding-right': 8 }}>Date: {this.props.spec.acquired.date}</td>
            <td style={{ 'padding-right': 8 }}>Old Label: {this.props.spec.states.old_label}</td>
            <td style={{ 'padding-right': 8 }}>Exhibit: {this.props.spec.storage_location.exhibit}</td>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}>Length: {this.props.spec.physical_dimensions.length} (cm)</td>
            <td
              style={{ 'padding-right': 8 }}>Additional: {this.props.spec.species.additional.reduce( ( acc, val ) => acc + ' ' + val, '' )}</td>
            <td style={{ 'padding-right': 8 }}>Level: {this.props.spec.discovery_location.level}</td>
            <td style={{ 'padding-right': 8 }}>By: {this.props.spec.analysis.by}</td>
            <td style={{ 'padding-right': 8 }}>Paid: {this.props.spec.acquired.paid} ($)</td>
            <td style={{ 'padding-right': 8 }}>Repair: {this.props.spec.states.repair}</td>
            <td style={{ 'padding-right': 8 }}>Inside: {this.props.spec.storage_location.inside}</td>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}>Width: {this.props.spec.physical_dimensions.width} (cm)</td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>Mine: {this.props.spec.discovery_location.mine}</td>
            <td style={{ 'padding-right': 8 }}>Method: {this.props.spec.analysis.method}</td>
            <td style={{ 'padding-right': 8 }}>From: {this.props.spec.acquired.from}</td>
            <td style={{ 'padding-right': 8 }}>Story: {this.props.spec.states.story}</td>
            <td style={{ 'padding-right': 8 }}>Outside: {this.props.spec.storage_location.outside}</td>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}>Height: {this.props.spec.physical_dimensions.height} (cm)</td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>District: {this.props.spec.discovery_location.district}</td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>Where: {this.props.spec.acquired.where}</td>
            <td style={{ 'padding-right': 8 }}>Figured: {this.props.spec.states.figured}</td>
            <td style={{ 'padding-right': 8 }}>Loan: {this.props.spec.storage_location.loan}</td>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}>Main Crystal: {this.props.spec.physical_dimensions.main_crystal} (cm)
            </td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>State: {this.props.spec.discovery_location.state}</td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>Details: {this.props.spec.storage_location.details}</td>
          </tr>
          <tr>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}>Country: {this.props.spec.discovery_location.country}</td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
            <td style={{ 'padding-right': 8 }}></td>
          </tr>
        </table>
      </div>
    );
  }
}

class Home extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { view: 'list' }
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

  goEdit() {
    this.setState( { view: 'edit' } );
  }

  goList() {
    this.setState( { view: 'list', selected: '' } );
  }

  render() {
    return (
      <div>
        <div style={{ padding: 8 }}>
          <button style={{ 'padding-right': 8 }} type="button" onClick={this.goEdit.bind( this )}>Add</button>
          <button type="button" onClick={this.logout.bind( this )}>Logout</button>
        </div>
        <div>{this.state.view === 'list' ? <ListView goEdit={this.goEdit.bind( this )}/> :
          <EditView goList={this.goList.bind( this )}/>}</div>
      </div>
    );
  }
}

class EditView extends React.Component {
  constructor( props ) {
    super( props );
    this.state = Object.assign(
      { loading: false },
      JSON.parse( JSON.stringify( cleanMineral ) )
    );
  }

  reset() {
    this.setState(
      Object.assign(
        { loading: false },
        JSON.parse( JSON.stringify( cleanMineral ) )
      )
    );
  }

  add() {
    if ( this.state.loading ) {
      return;
    }

    this.setState( {
      loading: true,
      'physical_dimensions.weight': parseInt( this.state[ 'physical_dimensions.weight' ] || '0' ),
      'physical_dimensions.length': parseInt( this.state[ 'physical_dimensions.length' ] || '0' ),
      'physical_dimensions.width': parseInt( this.state[ 'physical_dimensions.width' ] || '0' ),
      'physical_dimensions.height': parseInt( this.state[ 'physical_dimensions.height' ] || '0' ),
      'physical_dimensions.main_crystal': parseInt( this.state[ 'physical_dimensions.main_crystal' ] || '0' ),
      'acquired.paid': parseInt( this.state[ 'acquired.paid' ] || '0' ),
    } );

    API.specimen.add( { specimen: this.state }, ( err, result ) => {
      this.setState( { loading: false } );
      alert( err ? err.message : 'Success!' );
      if ( !err ) {
        this.reset();
      }
    } );
  }

  handleChange( e ) {
    const t = e.target;
    this.setState( { [ t.name ]: t.type === 'checkbox' ? t.checked : t.value } );
  }

  render() {
    return (
      <div>
        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Physical Dimensions</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Weight (g)</div>
            <input type="text" name="physical_dimensions.weight" value={this.state[ 'physical_dimensions.weight' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Length (cm)</div>
            <input type="text" name="physical_dimensions.length" value={this.state[ 'physical_dimensions.length' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Width (cm)</div>
            <input type="text" name="physical_dimensions.width" value={this.state[ 'physical_dimensions.width' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Height (cm)</div>
            <input type="text" name="physical_dimensions.height" value={this.state[ 'physical_dimensions.height' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>

          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Main Crystal (cm)</div>
            <input type="text" name="physical_dimensions.main_crystal"
                   value={this.state[ 'physical_dimensions.main_crystal' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Species</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Main</div>
            <input type="text" name="species.main" value={this.state[ 'species.main' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Additional</div>
            <input type="text" name="species.additional" value={this.state[ 'species.additional' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Discovery Location</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Stope</div>
            <input type="text" name="discovery_location.stope" value={this.state[ 'discovery_location.stope' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Level</div>
            <input type="text" name="discovery_location.level" value={this.state[ 'discovery_location.level' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Mine</div>
            <input type="text" name="discovery_location.mine" value={this.state[ 'discovery_location.mine' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>District</div>
            <input type="text" name="discovery_location.district" value={this.state[ 'discovery_location.district' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>State</div>
            <input type="text" name="discovery_location.state" value={this.state[ 'discovery_location.state' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Country</div>
            <input type="text" name="discovery_location.country" value={this.state[ 'discovery_location.country' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Analysis</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Analyzed</div>
            <input type="checkbox" name="analysis.analyzed" checked={this.state[ 'analysis.analyzed' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>By</div>
            <input type="text" name="analysis.by" value={this.state[ 'analysis.by' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Method</div>
            <input type="text" name="analysis.method" value={this.state[ 'analysis.method' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Acquired</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Date (DD-MM-YYYY ex: 09-23-1994)</div>
            <input type="text" name="acquired.date" value={this.state[ 'acquired.date' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Paid ($)</div>
            <input type="text" name="acquired.paid" value={this.state[ 'acquired.paid' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>From</div>
            <input type="text" name="acquired.from" value={this.state[ 'acquired.from' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Where</div>
            <input type="text" name="acquired.where" value={this.state[ 'acquired.where' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>States</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Old Label</div>
            <input type="checkbox" name="states.old_label" checked={this.state[ 'states.old_label' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Repair</div>
            <input type="checkbox" name="states.repair" checked={this.state[ 'states.repair' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Story</div>
            <input type="checkbox" name="states.story" checked={this.state[ 'states.story' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Figured</div>
            <input type="checkbox" name="states.figured" checked={this.state[ 'states.figured' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Storage Location</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Exhibit</div>
            <input type="checkbox" name="storage_location.exhibit" checked={this.state[ 'storage_location.exhibit' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Inside</div>
            <input type="checkbox" name="storage_location.inside" checked={this.state[ 'storage_location.inside' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Outside</div>
            <input type="checkbox" name="storage_location.outside" checked={this.state[ 'storage_location.outside' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Loan</div>
            <input type="checkbox" name="storage_location.loan" checked={this.state[ 'storage_location.loan' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Details</div>
            <input type="text" name="storage_location.details" value={this.state[ 'storage_location.details' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <strong>Other</strong>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Comments</div>
            <input type="text" name="comments" value={this.state[ 'comments' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Story</div>
            <input type="text" name="story" value={this.state[ 'story' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Figured</div>
            <input type="text" name="figured" value={this.state[ 'figured' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Repair History</div>
            <input type="text" name="repair_history" value={this.state[ 'repair_history' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Analysis History</div>
            <input type="text" name="analysis_history" value={this.state[ 'analysis_history' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
          <div style={{ padding: 8, display: 'inline-block' }}>
            <div>Specimen Location</div>
            <input type="text" name="specimen_location" value={this.state[ 'specimen_location' ]}
                   onChange={this.handleChange.bind( this )}/>
          </div>
        </div>

        <button type="button" onClick={this.props.goList}>Cancel</button>
        <button type="button" onClick={this.add.bind( this )}>Add!</button>
      </div>
    );
  }
}

class ListView extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      specimens: [],
      page: 0,
      pages: 0,
      limit: 10
    };
    this.search();
  }

  search() {
    if ( this.state.loading ) {
      return;
    }

    this.setState( { loading: true } );

    API.specimen.list( { limit: this.state.limit, offset: this.state.page * this.state.limit }, ( err, result ) => {
      this.setState( { loading: false } );

      if ( err ) {
        return alert( err.message );
      }

      this.setState( {
        specimens: result.specimens.map( s => <Specimen key={s._id} spec={s}/> ),
        page: Math.floor( result.offset / result.limit ),
        pages: Math.floor( result.total / result.limit )
      } );

    } );
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

  downloadJSON() {
    this.download( 'json' )
  }

  downloadCSV() {
    this.download( 'csv' )
  }

  download( type ) {
    //TODO: Query
    API.specimen.download( { type }, ( err, result ) => {
      if ( err ) {
        return alert( err.message );
      }
    } );
  }

  render() {
    return (
      <div>
        {/*TODO: SEARCH CRITERIA*/}
        <div style={{ padding: 8 }}>
          <button type="button" onClick={this.search.bind( this )}>Search</button>
        </div>
        <div style={{ padding: 8 }}>
          {this.state.specimens}
        </div>
        <div style={{ padding: 8 }}>
          <button style={{ 'margin-right': 8 }} type="button" onClick={this.first.bind( this )}>&lt;&lt;</button>
          <button style={{ 'margin-right': 8 }} type="button" onClick={this.previous.bind( this )}>&lt;</button>
          <span style={{ 'margin-right': 8 }}>{this.state.page + 1} of {this.state.pages + 1}</span>
          <button style={{ 'margin-right': 8 }} type="button" onClick={this.next.bind( this )}>&gt;</button>
          <button type="button" onClick={this.last.bind( this )}>&gt;&gt;</button>
          <button type="button" onClick={this.downloadJSON.bind( this )}>Download JSON</button>
          <button type="button" onClick={this.downloadCSV.bind( this )}>Download CSV</button>
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
    //TODO: DON"T SHORTUT THIS
    return this.props.changeView( 'home' );

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
        <input style={{ 'padding-right': 8 }} type="text" name="Password" value={this.state.password}
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