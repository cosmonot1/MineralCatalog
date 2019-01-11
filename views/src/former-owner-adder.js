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
    this.props.loadFormerOwners( this.state.formerOwners );
  }

  reset() {
    this.setState( { formerOwners: [] } );
  }

  buildFormerOwners( owners ) {
    if ( !owners.length ) {
      return <div></div>;
    }

    const col1 = [ <div style={{ 'marginBottom': 4 }}>Owner</div> ];
    const col2 = [ <div style={{ 'marginBottom': 4 }}>Year Acquired (By Owner)</div> ];

    owners.forEach( ( o, i ) => {

      col1.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="owner"
                 value={this.state.formerOwners[ i ][ 'owner' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

      col2.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="year_acquired"
                 value={this.state.formerOwners[ i ][ 'year_acquired' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

    } );

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col1}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col2}</div>
      </div>
    );
  }


  render() {
    return (
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ 'marginRight': 8 }}>Former Owners</span>
          {this.state.formerOwners.length ?
            <button style={{ 'marginRight': 8 }} type="button"
                    onClick={this.removeFormerOwners.bind( this )}>-</button> : ''}
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.addFormerOwners.bind( this )}>+</button>
        </div>
        <div style={{ display: 'inline-block' }}>{this.buildFormerOwners.call( this, this.state.formerOwners )}</div>
      </div>
    );
  }

}

export default FormerOwnerAdder;
