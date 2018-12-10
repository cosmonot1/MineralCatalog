/*
Scenario: The Front End team working on your note taking app from Activity B has unexpectedly quit. You must build the front end for this application using React. Your front end should have two views, a Home view and an Edit view. Create a react component for each view. The home view should have a button that changes the view to the edit view. The edit view should have a button that switches back to the home view, a text input that contains the note text, a load button that calls the API load route, and a save button that calls the API save route. A NodeJS server has been provided to you. Write your React code in 'Lesson 6/topic c/activity/src/index.js.' When you are ready to test your code run the build script (defined in package.json) before starting the server. You can reference the index.html file from Activity B for hints on how to call the API routes.
 */

class Home extends React.Component {
  goEdit() {
    this.props.changeView( 'editor' )
  }

  render() {
    return (
      <div>
        <h1>Note Editor App</h1>
        <button type="button" onClick={this.goEdit.bind( this )}>Edit Note</button>
      </div>
    );
  }
}

class Editor extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { value: '' };
  }

  handleChange( e ) {
    this.setState( { value: e.target.value } );
  }

  save() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if ( this.readyState != 4 ) {
        return
      }
      if ( this.status !== 200 ) {
        return console.error( 'Failed to save note!' );
      }
    };

    xhttp.open( "POST", "/save", true );
    xhttp.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    xhttp.send( JSON.stringify( this.state.value ) );
  }

  load() {
    const xhttp = new XMLHttpRequest();
    const that = this;

    xhttp.onreadystatechange = function () {
      if ( this.readyState != 4 ) {
        return
      }
      if ( this.status !== 200 ) {
        return console.error( 'Failed to load note!' );
      }
      that.setState( { value: JSON.parse( this.response ) } );
    };

    xhttp.open( "GET", "/load", true );
    xhttp.send();
  }

  goHome() {
    this.props.changeView( 'home' );
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.goHome.bind( this )}>Back to home</button>
        <input type="text" name="Note Text" value={this.state.value} onChange={this.handleChange.bind( this )}/>
        <button type="button" onClick={this.load.bind( this )}>Load</button>
        <button type="button" onClick={this.save.bind( this )}>Save</button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { view: 'home' };
    this.changeView = this.changeView.bind( this );
  }

  changeView( view ) {
    this.setState( { view } )
  }

  render() {
    return <div>{this.state.view === 'home' ? <Home changeView={this.changeView}/> :
      <Editor changeView={this.changeView}/>}</div>;
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById( 'root' )
);