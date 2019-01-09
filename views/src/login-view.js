import React from 'react';

class LoginView extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = { password: '' };
  }

  handleChange ( e ) {
    this.setState( { password: e.target.value } );
  }

  login () {
    const pw = this.state.password;
    this.setState( { password: '' } );

    try {

      //If successful change state
      API.user.authorize( { password: pw }, ( err ) => {
        if ( err ) {
          return alert( 'Incorrect password!' );
        }
        this.props.changeView( 'home' );
      } );
    } catch ( err ) {
      alert( err.message );
    }
  }

  render () {
    return (
      <div>
        <input style={{ 'marginRight': 8 }} type="text" name="Password" value={this.state.password}
               onChange={this.handleChange.bind( this )}/>
        <button type="button" style={{ cursor: 'pointer' }} onClick={this.login.bind( this )}>Login</button>
      </div>
    )
  }
}

export default LoginView;
