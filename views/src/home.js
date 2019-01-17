import React from 'react';
import EditView from './edit-view';
import ListView from './list-view';
import ImportView from './import-view';

class Home extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = { view: 'list', spec: null, mode: 'add' }
  }

  logout () {
    this.props.changeView( 'login' );
    this.state = { view: 'list' };
    API.user.logout( {}, ( err ) => {
      if ( err ) {
        alert( 'Logout failed' );
      }
    } );
  }

  edit () {
    this.changeView( 'edit', null, 'add' );
  }

  import () {
    this.changeView( 'import' );
  }

  changeView ( type, spec, mode ) {
    switch ( type ) {
      case 'edit':
        this.setState( { view: 'edit', spec: spec || null, mode: mode || 'add' } );
        break;
      case 'import':
        this.setState( { view: 'import' } );
        break;
      default:
        this.setState( { view: 'list', selected: '' } );
    }
    this.setState( {} );
  }

  selectView ( view ) {
    switch ( view ) {
      case 'list':
        return <ListView changeView={this.changeView.bind( this )} goImport/>;
      case 'edit':
        return <EditView changeView={this.changeView.bind( this )} mode={this.state.mode} spec={this.state.spec}/>;
      case 'import':
        return <ImportView changeView={this.changeView.bind( this )}/>;
    }
  }

  render () {
    return (
      <div>
        <div style={{ padding: 8 }}>
          {this.state.view === 'edit' ? '' :
            <button style={{ 'marginRight': 8 }} type="button" onClick={this.edit.bind( this )}>Add</button>}
          {this.state.view === 'import' ? '' :
            <button style={{ 'marginRight': 8 }} type="button" onClick={this.import.bind( this )}>Import</button>}
          <button type="button" onClick={this.logout.bind( this )}>Logout</button>
        </div>
        <div>{this.selectView( this.state.view )}</div>
      </div>
    );
  }
}

export default Home;
