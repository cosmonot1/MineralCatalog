import React from 'react';
import EditView from './edit-view';
import ListView from './list-view';

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
    this.goEdit( null, 'add' );
  }

  goEdit ( spec, mode ) {
    this.setState( { view: 'edit', spec: spec || null, mode: mode || 'add' } );
  }

  goList () {
    this.setState( { view: 'list', selected: '' } );
  }

  render () {
    return (
      <div>
        <div style={{ padding: 8 }}>
          {this.state.view === 'edit' ? '' :
            <button style={{ 'marginRight': 8 }} type="button" onClick={this.edit.bind( this )}>Add</button>}
          <button type="button" onClick={this.logout.bind( this )}>Logout</button>
        </div>
        <div>{this.state.view === 'list' ? <ListView goEdit={this.goEdit.bind( this )}/> :
          <EditView goList={this.goList.bind( this )} mode={this.state.mode} spec={this.state.spec}/>}</div>
      </div>
    );
  }
}

export default Home;
