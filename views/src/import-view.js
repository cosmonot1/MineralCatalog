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
      return <div></div>;
    }

    const col1 = [
      <div key={'col1_header'} style={{ 'marginRight': 8, 'marginBottom': 4 }}>
        <strong>Loaded Column</strong>
      </div>
    ];
    const col2 = [
      <div key={'col2_header'} style={{ 'marginRight': 8, 'marginBottom': 4 }}>
        <strong>-></strong>
      </div>
    ];
    const col3 = [
      <div key={'col3_header'} style={{ 'marginRight': 8, 'marginBottom': 4 }}>
        <strong>Specimen Field</strong>
      </div>
    ];
    const col4 = [
      <div key={'col4_header'} style={{ 'marginRight': 8, 'marginBottom': 4 }}>
        <strong>Link</strong>
      </div>
    ];

    c.forEach( ( c, i ) => {
      col1.push(
        <div key={`col1_${i}`} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <span>{c.sheet_name}</span>
        </div> );

      col2.push(
        <div key={`col2_${i}`} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <span>-></span>
        </div> );

      col3.push(
        <div key={`col3_${i}`} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <span>{c.display_name}</span>
        </div> );

      col4.push(
        <div key={`col4_${i}`} style={{ 'marginRight': 8, 'marginBottom': 4, flex: 1 }}>
          <button onClick={c.link ? this.unlinkColumn.bind( this ) : this.showModal.bind( this )}
                  editidx={i}>{c.link ? 'Unlink' : 'Link'}</button>
        </div> );
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

  formatLinkableColumns( c ) {
    if ( !c || !c.length ) {
      return '';
    }

    return (
      <div>
        {this.state.linkCol.map( ( c, i ) => {
          return (
            <div key={uuidv4()} linkidx={i} onClick={this.linkColumn.bind( this )}>
              <span>{c.display_name}</span>
            </div>
          );
        } )}
      </div>
    );
  }

  showModal( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    this.setState( { modal: true, idx } );
  }

  hideModal() {
    this.setState( { modal: false, idx: undefined } );
  }

  unlinkColumn( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    const column = this.state.columns[ idx ];

    const link = { display_name: column.display_name, link: column.link, nestedArray: column.nestedArray };
    delete column.display_name;
    delete column.link;
    delete column.nestedArray;

    const linkCol = this.state.linkCol;
    if ( !link.nestedArray ) {
      linkCol.push( link );
    }

    this.setState( {
      columns: [
        ...this.state.columns.slice( 0, idx ),
        column,
        ...this.state.columns.slice( idx + 1 )
      ],
      linkCol
    } );
  }

  linkColumn( e ) {
    const linkIdx = parseInt( e.currentTarget.getAttribute( 'linkidx' ) );
    const linkCol = this.state.linkCol[ linkIdx ];

    const columns = this.state.columns;
    columns[ this.state.idx ] = Object.assign(
      {},
      columns[ this.state.idx ],
      linkCol
    );

    this.setState( {
      columns,
      linkCol: [
        ...this.state.linkCol.slice( 0, linkIdx ),
        ...this.state.linkCol.slice( linkIdx + Number( !linkCol.nestedArray ) ),
      ]
    } );

    this.hideModal();
  }

  render() {
    return (
      <div style={{ marginLeft: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <span>Import into the database. Supports Excel files.</span>
        </div>

        <div style={{ marginBottom: 8 }}>
          <input type="file" name="file_input" onChange={this.loadFile.bind( this )}
                 ref={ref => this.fileInput = ref}/>
          <button type="button" onClick={this.import.bind( this )}>Import</button>
        </div>

        <div>
          {this.formatLoadedColumns.call( this, this.state.columns )}
        </div>

        <Modal show={this.state.modal} handleClose={this.hideModal.bind( this )}>
          <p>Link Specimen Data Field to Excel Column</p>
          <div>{this.formatLinkableColumns.call( this, this.state.linkCol )}</div>
        </Modal>
      </div>
    );
  }

}

export default ImportView;
