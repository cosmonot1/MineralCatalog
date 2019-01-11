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

  buildExhibits( exhibits ) {

    if ( !exhibits.length ) {
      return <div></div>
    }

    const col1 = [ <div style={{ 'marginBottom': 4 }}>Show</div> ];
    const col2 = [ <div style={{ 'marginBottom': 4 }}>Year</div> ];
    const col3 = [ <div style={{ 'marginBottom': 4 }}>Competition</div> ];
    const col4 = [ <div style={{ 'marginBottom': 4 }}>Award</div> ];

    exhibits.forEach( ( e, i ) => {

      col1.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="show"
                 value={this.state.exhibits[ i ][ 'show' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

      col2.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="year"
                 value={this.state.exhibits[ i ][ 'year' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

      col3.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="comp"
                 value={this.state.exhibits[ i ][ 'comp' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

      col4.push( (
        <div key={i} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <input key={`input_${i}`} editidx={i} type="text" name="award"
                 value={this.state.exhibits[ i ][ 'award' ]} onChange={this.handleChange.bind( this )}/>
        </div>
      ) );

    } );

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col1}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col2}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col3}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{col4}</div>
      </div>
    );
  }


  render() {
    return (
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ 'marginRight': 8 }}>Exhibits</span>
          {this.state.exhibits.length ?
            <button style={{ 'marginRight': 8 }} type="button"
                    onClick={this.removeExhibits.bind( this )}>-</button> : ''}
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.addExhibits.bind( this )}>+</button>
        </div>
        <div style={{ display: 'inline-block' }}>{this.buildExhibits.call( this, this.state.exhibits )}</div>
      </div>
    );
  }

}

export default ExhibitAdder;
