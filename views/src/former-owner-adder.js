import React from 'react';

class FormerOwnerAdder extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      formerOwners: this.props.formerOwners
    };
  }

  handleChange( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    const state = Object.assign( {}, this.state.formerOwners[ idx ], { [ e.target.name ]: e.target.value } );

    this.setState( {
      formerOwners: [
        ...this.state.formerOwners.slice( 0, idx ),
        state,
        ...this.state.formerOwners.slice( idx + 1 )
      ]
    }, this.notifyFormerOwners.bind( this ) );
  }

  removeFormerOwners() {
    this.setState( {
      formerOwners: this.state.formerOwners.slice( 0, -1 )
    }, this.notifyFormerOwners.bind( this ) );
  }

  addFormerOwners() {
    this.setState( {
      formerOwners: [
        ...this.state.formerOwners,
        { show: '', year: '', comp: '', award: '' }
      ]
    }, this.notifyFormerOwners.bind( this ) );
  }

  notifyFormerOwners() {
    this.props.loadFormerOwners( this.state.formerOwners);
  }

  reset() {
    this.setState( { formerOwners: [] } );
  }

  buildFormerOwners( s, i ) {
    return (
      <div key={i} style={{ display: 'inline-block' }}>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="show"
               value={this.state.formerOwners[ i ][ 'show' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="comp"
               value={this.state.formerOwners[ i ][ 'comp' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="award"
               value={this.state.formerOwners[ i ][ 'award' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="year"
               value={this.state.formerOwners[ i ][ 'year' ]}
               onChange={this.handleChange.bind( this )}/>
      </div>
    );
  }


  render() {
    return (
      <div>
        <div>Former Owners</div>
        {this.state.formerOwners.map( this.buildFormerOwners.bind( this ) )}
        {this.state.formerOwners.length ?
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.removeFormerOwners.bind( this )}>-</button> : ''}
        <button style={{ 'marginRight': 8 }} type="button" onClick={this.addFormerOwners.bind( this )}>+</button>
      </div>
    );
  }

}

export default FormerOwnerAdder;
