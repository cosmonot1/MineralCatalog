import React from 'react';
import SearchItem from './search-item';
import { cleanSearchItem } from './utils.js';

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
        state.value = parseFloat( state.value );
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

export default SearchCriteria
