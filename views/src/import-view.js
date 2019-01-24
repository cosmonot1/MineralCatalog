import React from 'react';
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js';
import { cleanMineral, Modal } from './utils';

class ImportView extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      sheet: [],
      columns: [],
      modal: false
    };
  }

  reset () {
    this.fileInput.value = '';
    this.setState( { sheet: [], columns: [], modal: false } );
  }

  goHome () {
    this.reset();
    this.props.changeView( 'list' );
  }

  loadFile ( e ) {
    const reader = new FileReader();
    reader.onload = ( e ) => {
      // Parse workbook
      const data = e.target.result;
      const workbook = XLSX.read( data, { type: 'binary' } );
      const sheet = XLSX.utils.sheet_to_json( workbook.Sheets[ workbook.SheetNames[ 0 ] ] );

      // Get column names from sheet
      const headerNames = new Set();
      sheet.forEach( s => Object.keys( s ).forEach( k => headerNames.add( k ) ) );
      const columns = [ ...headerNames ].map( v => ( { sheet_name: v, display_name: '', link: '' } ) );

      // Set column names
      this.setState( { sheet, columns } );
    };
    reader.readAsBinaryString( e.target.files[ 0 ] );
  }

  import () {
    // Build specimens from association
    // Call to API to bulk add
  }

  formatLoadedColumns () {
    return this.state.columns.map( ( c, i ) => {
      return (
        <div key={uuidv4()}>
          <span>{c.sheet_name}</span>=><span>{c.display_name}</span>
          <button onClick={this.showModal} editidx={i}>Link</button>
        </div>
      );
    } );
  }

  showModal ( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    this.setState( { modal: true, idx } );
  }

  hideModal () {
    this.setState( { modal: false, idx: undefined } );
  }

  linkColumn ( e ) {
    const columns = this.state.columns;
    columns[ this.state.idx ].display_name = 'test';
    columns[ this.state.idx ].link = 'test';
    this.setState( { columns } );
  }

  render () {
    return (
      <div>
        <div>
          <span>Import into the database. Supports Excel files.</span>
        </div>
        <div>
          <input type="file" name="file_input" onChange={this.loadFile.bind( this )}
                 ref={ref => this.fileInput = ref}/>
          <button type="button" onClick={this.import.bind( this )}>Import</button>
        </div>
        <div>
          {this.formatLoadedColumns.call( this )}
        </div>
        <Modal show={this.state.modal} handleClose={this.hideModal}>
          <p>Link Column</p>
          <p>Data</p>
        </Modal>
      </div>
    );
  }

}

export default ImportView;
