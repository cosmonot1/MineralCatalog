import React from 'react';
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js';
import { linkColumns, Modal } from './utils';

class ImportView extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      sheet: [],
      columns: [],
      modal: false,
      importErrors: []
    };
  }

  reset () {
    this.fileInput.value = '';
    this.setState( {
      sheet: [], columns: [], modal: false, linkCol: undefined, importErrors: []
    } );
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

      const linkCol = JSON.parse( JSON.stringify( linkColumns ) );

      // Set column names
      this.setState( { sheet, columns, linkCol } );
    };
    reader.readAsBinaryString( e.target.files[ 0 ] );
  }

  import () {

    // Check to make sure that all of the columns loaded from the excel file are assigned to a specimen field
    const allLinked = this.state.columns.some( c => !c.link );
    let shouldContinue = true;

    // See if the user wants to proceed
    if ( !allLinked ) {
      //TODO: make this a better dialog actually in the app
      shouldContinue = confirm( "Not all imported columns were linked to a specimen field. Proceeding may result in incomplete data in the database. Do you want to continue with the import?" );
    }

    if ( !shouldContinue ) {
      return;
    }

    // Build specimens from association
    const fieldMap = {};
    this.state.columns.filter( c => c.link ).forEach( c => fieldMap[ c.sheet_name ] = c );
    const specimens = this.state.sheet.map( buildSpecimen.call( this, fieldMap ) ).filter( s => s );

    // Call to API to bulk add
    API.specimen.bulk.add( { specimens }, ( err ) => {
      if ( !err ) {
        alert( 'Import successful' );
        return this.reset();
      }
      console.log( err );
      alert( 'Import errors found and shown below.' );
      this.setState( { importErrors: err || [] } );
    } );

    function buildSpecimen ( fieldMap ) {

      return s => {
        const specimen = {};
        let found;
        // For each property in the object imported from excel
        for ( let k in s ) {

          // Make sure the property is mapped to a specimen field
          if ( k in fieldMap ) {
            found = true;
            const field = Object.assign( {}, fieldMap[ k ] );

            if ( field.nestedArray ) {
              const linkParts = field.link.split( '.*.' );
              field.link = linkParts[ 0 ];
              field.nestedPath = linkParts[ 1 ];

              console.log( field.link, field.nestedPath );

              if ( !specimen[ field.link ] ) {
                specimen[ field.link ] = [];
              }

              //TODO: HAVE IDX COME FROM A FIELD MAMP
              const idx = parseInt( field.sheet_name.split( '_' ).slice( -1 )[ 0 ], 10 ) || 0;
              if ( !specimen[ field.link ][ idx ] ) {
                specimen[ field.link ][ idx ] = {};
              }

              specimen[ field.link ][ idx ][ field.nestedPath ] = s[ k ];
            } else {
              if ( !field.link ) {
                console.log( field );
              }
              specimen[ field.link ] = s[ k ];
            }
          }
        }

        return found ? specimen : null;

      };
    }
  }

  formatLoadedColumns ( c ) {
    if ( !c || !c.length ) {
      return <div></div>;
    }

    if ( this.state.importErrors.length ) {
      return <div></div>
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

  formatLinkableColumns ( c ) {
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

  showModal ( e ) {
    const idx = parseInt( e.target.getAttribute( 'editidx' ) );
    this.setState( { modal: true, idx } );
  }

  hideModal () {
    this.setState( { modal: false, idx: undefined } );
  }

  formatErrors ( errors ) {
    if ( !errors.length ) {
      return <div></div>;
    }

    return (
      <div>
        <div><span>Failed to import {errors.length} of {this.state.sheet.length} specimens</span></div>
        <div>
          {/*Error*/}
        </div>
      </div>
    );
  }

  unlinkColumn ( e ) {
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

  linkColumn ( e ) {
    //TODO: FIGURE OUT HOW TO DO DOCUMENTS AND PHOTOS -> CSV OR WHITESPACE-SV OR EXCEL COLUMN PER DOC/PHOTO
    //TODO: UPLOAD FIELD FOR DOCUMENTS AND STUFF
    //TODO: FOR NESTEDARRAY TYPES, HAVE A USER INPUT FIELD THAT SETS WHAT ARRAY INDEX ORDER IT IS

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

  render () {
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
          {this.formatErrors.call( this, this.state.importErrors )}
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
