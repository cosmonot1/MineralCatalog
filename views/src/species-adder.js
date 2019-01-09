import React from 'react';

export default SpeciesAdder;

class SpeciesAdder extends React.Component {
  constructor ( props ) {
    super( props );

    this.state = {
      species: this.props.species
    };
    this.options = [
      'on',
      'in',
      'with',
      'variety',
      'pseudo.',
      'epi.'
    ];
  }

  handleChange ( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    const state = Object.assign( {}, this.state.species[ idx ], { [ e.target.name ]: e.target.value } );

    this.setState( {
      species: [
        ...this.state.species.slice( 0, idx ),
        state,
        ...this.state.species.slice( idx + 1 )
      ]
    }, this.notifySpecies.bind( this ) );
  }

  removeSpecies () {
    this.setState( {
      species: this.state.species.slice( 0, -1 )
    }, this.notifySpecies.bind( this ) );
  }

  addSpecies () {
    this.setState( {
      species: [
        ...this.state.species,
        { species: '', modifier: 'on' }
      ]
    }, this.notifySpecies.bind( this ) );
  }

  notifySpecies () {
    this.props.loadSpecies( this.state.species );
  }

  reset () {
    this.setState( { species: [] } );
  }

  buildSpecies ( s, i ) {
    return (
      <div key={i} style={{ display: 'inline-block' }}>
        <select style={{ 'marginRight': 8 }} key={`select_${i}`} editidx={i} name="modifier"
                value={this.state.species[ i ].modifier}
                onChange={this.handleChange.bind( this )}>
          {this.options.map( o => <option key={uuidv4()} value={o}>{o}</option> )}
        </select>
        <input key={`input_${i}`} editidx={i} style={{ 'marginRight': 8 }} type="text" name="species"
               value={this.state.species[ i ][ 'species' ]}
               onChange={this.handleChange.bind( this )}/>
      </div>
    );
  }


  render () {
    return (
      <div>
        <div>Additional</div>
        {this.state.species.map( this.buildSpecies.bind( this ) )}
        {this.state.species.length ?
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.removeSpecies.bind( this )}>-</button> : ''}
        <button style={{ 'marginRight': 8 }} type="button" onClick={this.addSpecies.bind( this )}>+</button>
      </div>
    );
  }

}
