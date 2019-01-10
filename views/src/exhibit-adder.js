import React from 'react';

class ExhibitAdder extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      exhibits: this.props.exhibits
    };
  }

  handleChange( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    const state = Object.assign( {}, this.state.exhibits[ idx ], { [ e.target.name ]: e.target.value } );

    this.setState( {
      exhibits: [
        ...this.state.exhibits.slice( 0, idx ),
        state,
        ...this.state.exhibits.slice( idx + 1 )
      ]
    }, this.notifyExhibits.bind( this ) );
  }

  removeExhibits() {
    this.setState( {
      exhibits: this.state.exhibits.slice( 0, -1 )
    }, this.notifyExhibits.bind( this ) );
  }

  addExhibits() {
    this.setState( {
      exhibits: [
        ...this.state.exhibits,
        { show: '', year: '', comp: '', award: '' }
      ]
    }, this.notifyExhibits.bind( this ) );
  }

  notifyExhibits() {
    this.props.loadExhibits( this.state.exhibits );
  }

  reset() {
    this.setState( { exhibits: [] } );
  }

  buildExhibits( s, i ) {
    return (
      <div key={i} style={{ display: 'inline-block' }}>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="show"
               value={this.state.exhibits[ i ][ 'show' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="comp"
               value={this.state.exhibits[ i ][ 'comp' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="award"
               value={this.state.exhibits[ i ][ 'award' ]}
               onChange={this.handleChange.bind( this )}/>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="year"
               value={this.state.exhibits[ i ][ 'year' ]}
               onChange={this.handleChange.bind( this )}/>
      </div>
    );
  }


  render() {
    return (
      <div>
        <div>Exhibits</div>
        {this.state.exhibits.map( this.buildExhibits.bind( this ) )}
        {this.state.exhibits.length ?
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.removeExhibits.bind( this )}>-</button> : ''}
        <button style={{ 'marginRight': 8 }} type="button" onClick={this.addExhibits.bind( this )}>+</button>
      </div>
    );
  }

}

export default ExhibitAdder;
