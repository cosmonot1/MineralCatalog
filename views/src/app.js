import React from 'react';
import LoginView from './login-view.js';
import Home from './home.js';
import './app.css';

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

export default App;
