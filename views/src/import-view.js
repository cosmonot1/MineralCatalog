import React from 'react';

class ImportView extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      file_input: null
    };
  }

  reset () {
    this.fileInput.value = '';
  }

  handleChange ( e ) {
    const t = e.target;
    this.setState( {
      [ t.name ]: t.files
    } );
  }

  goHome () {
    this.reset();
    this.props.changeView( 'list' );
  }

  render () {
    return (
      <div>
        <div>
          <span>Import into the database. Supports Excel files.</span>
        </div>
        <div>
          <input type="file" name="file_input" onChange={this.handleChange.bind( this )}
                 ref={ref => this.fileInput = ref}/>
          <button type="button" onClick={this.import.bind( this )}>Import</button>
        </div>
      </div>
    );
  }

}

export default ImportView;
