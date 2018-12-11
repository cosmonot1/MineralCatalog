const cleanMineral = {
  'physical_dimensions.weight': '',
  'physical_dimensions.length': '',
  'physical_dimensions.width': '',
  'physical_dimensions.height': '',
  'physical_dimensions.main_crystal': '',
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
  specimen_location: ''
};

class Home extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { view: 'list' }
  }

  logout() {
    this.props.changeView( 'login' );
    this.state = { view: 'list' };
    API.user.logout( {}, () => {
      if ( err ) {
        alert( 'Logout failed' );
      }
    } );
    // TODO: call logout route and clear cookie
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
        <div>
          <button type="button" onClick={this.goEdit.bind( this )}>Add</button>
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
    this.reset();
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
      'acquired.paid': parseInt( this.state[ 'acquired.paid' ] )
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
          Physical Dimensions
          <input type="text" name="physical_dimensions.weight" value={this.state[ 'physical_dimensions.weight' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="physical_dimensions.length" value={this.state[ 'physical_dimensions.length' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="physical_dimensions.width" value={this.state[ 'physical_dimensions.width' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="physical_dimensions.height" value={this.state[ 'physical_dimensions.height' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="physical_dimensions.main_crystal"
                 value={this.state[ 'physical_dimensions.main_crystal' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Species
          <input type="text" name="species.main" value={this.state[ 'species.main' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="species.additional" value={this.state[ 'species.additional' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Discovery Location
          <input type="text" name="discovery_location.stope" value={this.state[ 'discovery_location.stope' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="discovery_location.level" value={this.state[ 'discovery_location.level' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="discovery_location.mine" value={this.state[ 'discovery_location.mine' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="discovery_location.district" value={this.state[ 'discovery_location.district' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="discovery_location.state" value={this.state[ 'discovery_location.state' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="discovery_location.country" value={this.state[ 'discovery_location.country' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Analysis
          <input type="checkbox" name="analysis.analyzed" checked={this.state[ 'analysis.analyzed' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="analysis.by" value={this.state[ 'analysis.by' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="analysis.method" value={this.state[ 'analysis.method' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Acquired
          <input type="text" name="acquired.date" value={this.state[ 'acquired.date' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="acquired.paid" value={this.state[ 'acquired.paid' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="acquired.from" value={this.state[ 'acquired.from' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="acquired.where" value={this.state[ 'acquired.where' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          States
          <input type="checkbox" name="states.old_label" checked={this.state[ 'states.old_label' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="states.repair" checked={this.state[ 'states.repair' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="states.story" checked={this.state[ 'states.story' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="states.figured" checked={this.state[ 'states.figured' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Storage Location
          <input type="checkbox" name="storage_location.exhibit" checked={this.state[ 'storage_location.exhibit' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="storage_location.inside" checked={this.state[ 'storage_location.inside' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="storage_location.outside" checked={this.state[ 'storage_location.outside' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="checkbox" name="storage_location.loan" checked={this.state[ 'storage_location.loan' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="storage_location.details" value={this.state[ 'storage_location.details' ]}
                 onChange={this.handleChange.bind( this )}/>
        </div>

        <div>
          Other
          <input type="text" name="comments" value={this.state[ 'comments' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="story" value={this.state[ 'story' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="figured" value={this.state[ 'figured' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="repair_history" value={this.state[ 'repair_history' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="analysis_history" value={this.state[ 'analysis_history' ]}
                 onChange={this.handleChange.bind( this )}/>
          <input type="text" name="specimen_location" value={this.state[ 'specimen_location' ]}
                 onChange={this.handleChange.bind( this )}/>
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
  }

  render() {
    return (
      <div>
        LIST OF STUFF
        <button type="button" onClick={this.props.goEdit}>Edit</button>
        {/*<input type="text" name="Note Text" value={this.state.value} onChange={this.handleChange.bind( this )}/>*/}
        {/*<button type="button" onClick={this.load.bind( this )}>Load</button>*/}
        {/*<button type="button" onClick={this.save.bind( this )}>Save</button>*/}
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
        <input type="text" name="Password" value={this.state.password} onChange={this.handleChange.bind( this )}/>
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
        <h1>Mineral Catalog</h1>
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