import React from 'react';
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js';
import { linkColumns, Modal } from './utils';

class ImportView extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      sheet: [],
      columns: [],
      modal: false
    };
  }

  reset() {
    this.fileInput.value = '';
    this.setState( { sheet: [], columns: [], modal: false, linkCol: undefined } );
  }

  goHome() {
    this.reset();
    this.props.changeView( 'list' );
  }

  loadFile( e ) {
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

      const linkCol = JSON.parse( JSON.stringify( linkColumns ) );

      // Set column names
      this.setState( { sheet, columns, linkCol } );
    };
    reader.readAsBinaryString( e.target.files[ 0 ] );
  }

  import() {
    // Make sure that all columns are linked. If not throw a pop up that forces user to confirm that they want to
    // proceed with potentially incomplete info for specimens
    // Build specimens from association
    // Call to API to bulk add
  }

  formatLoadedColumns( c ) {
    if ( !c || !c.length ) {
      return '';
    }

    return this.state.columns.map( ( c, i ) => {
      return (
        <div key={uuidv4()}>
          <span>{c.sheet_name}</span>=><span>{c.display_name}</span>
          <button onClick={this.showModal} editidx={i}>Link</button>
        </div>
      );
    } );
  }

  formatLinkableColumns( c ) {
    if ( !c || !c.length ) {
      return '';
    }

  }

  showModal( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    this.setState( { modal: true, idx } );
  }

  hideModal() {
    // get selected link column from state
    // Assign link column to proper column[state.idx]
    // Remove linked column from link column list
    this.setState( { modal: false, idx: undefined } );
  }

  linkColumn( e ) {
    const columns = this.state.columns;
    columns[ this.state.idx ].display_name = 'test';
    columns[ this.state.idx ].link = 'test';
    this.setState( { columns } );
  }

  render() {
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
          {( this.state.columns && this.state.columns.length ) : <div><span>Loaded Excel Sheet Columns</span></div> ? ''}
          {this.formatLoadedColumns.call( this, this.state.columns )}
        </div>
        <Modal show={this.state.modal} handleClose={this.hideModal}>
          <p>Link Specimen Data Field to Excel Column</p>
          {this.formatLinkableColumns.call( this, this.state.linkCol )}
        </Modal>
      </div>
    );
  }

}

export default ImportView;
