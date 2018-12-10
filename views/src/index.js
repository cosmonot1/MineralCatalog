/*
Scenario: The Front End team working on your note taking app from Activity B has unexpectedly quit. You must build the front end for this application using React. Your front end should have two views, a Home view and an Edit view. Create a react component for each view. The home view should have a button that changes the view to the edit view. The edit view should have a button that switches back to the home view, a text input that contains the note text, a load button that calls the API load route, and a save button that calls the API save route. A NodeJS server has been provided to you. Write your React code in 'Lesson 6/topic c/activity/src/index.js.' When you are ready to test your code run the build script (defined in package.json) before starting the server. You can reference the index.html file from Activity B for hints on how to call the API routes.
 */

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
  }

  render() {
    return (
      <div>
        EDIT/ADD VIEW!!! WOOO
        <button type="button" onClick={this.props.goList}>Back to list</button>
        {/*<input type="text" name="Note Text" value={this.state.value} onChange={this.handleChange.bind( this )}/>*/}
        {/*<button type="button" onClick={this.load.bind( this )}>Load</button>*/}
        {/*<button type="button" onClick={this.save.bind( this )}>Save</button>*/}
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