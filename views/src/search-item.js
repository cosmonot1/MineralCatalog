import React from 'react';
import { searchCriteria,searchOperators,cleanSearchItem } from './utils.js';

export default SearchItem;

class SearchItem extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = cleanSearchItem;
  }

  handleChange ( e ) {
    const state = { [ e.target.name ]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    if ( e.target.name === 'metric' ) {
      state.operatorType = ( searchCriteria.find( sc => sc.field === e.target.value ) || { type: 'numeric' } ).type;
      state.operator = searchOperators[ state.operatorType ][ 0 ].operator;
    }

    this.setState( state, () => {
      this.props.getState( this.props.specialKey, this.state );
    } );
  }

  decideInput ( type ) {
    if ( type === 'boolean' ) {
      return <input type="checkbox" name="checked" checked={this.state.checked}
                    onChange={this.handleChange.bind( this )}/>
    }
    return <input type="text" name="value" value={this.state.value}
                  onChange={this.handleChange.bind( this )}/>
  }

  render () {
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
