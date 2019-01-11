import React from 'react';

class SpeciesAdder extends React.Component {
  constructor( props ) {
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

  handleChange( e ) {
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

  removeSpecies() {
    this.setState( {
      species: this.state.species.slice( 0, -1 )
    }, this.notifySpecies.bind( this ) );
  }

  addSpecies() {
    this.setState( {
      species: [
        ...this.state.species,
        { species: '', modifier: 'on' }
      ]
    }, this.notifySpecies.bind( this ) );
  }

  notifySpecies() {
    this.props.loadSpecies( this.state.species );
  }

  reset() {
    this.setState( { species: [] } );
  }

  buildSpecies( species ) {
    if ( !species.length ) {
      return <div></div>;
    }

    const col1 = [ <div style={{ 'marginBottom': 4 }}>Modifier</div> ];
    const col2 = [ <div style={{ 'marginBottom': 4 }}>Species</div> ];

    species.forEach( ( s, i ) => {
      col1.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <select key={`select_${i}`} editidx={i} name="modifier"
                  value={this.state.species[ i ].modifier}
                  onChange={this.handleChange.bind( this )}>
            {this.options.map( o => <option key={uuidv4()} value={o}>{o}</option> )}
          </select>
        </div>
      ) );

      col2.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="species"
                 value={this.state.species[ i ][ 'species' ]}
                 onChange={this.handleChange.bind( this )}/>
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
          <span style={{ 'marginRight': 8 }}>Additional</span>
          {this.state.species.length ?
            <button style={{ 'marginRight': 8 }} type="button"
                    onClick={this.removeSpecies.bind( this )}>-</button> : ''}
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.addSpecies.bind( this )}>+</button>
        </div>
        <div style={{ display: 'inline-block' }}>{this.buildSpecies.call( this, this.state.species )}</div>
      </div>
    );
  }

}

export default SpeciesAdder;
