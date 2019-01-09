import React from 'react';
import SearchCriteria from './search-criteria.js';
import Specimen from './specimen.js';

export default ListView;

//TODO: IMAGE Size and aspect ratio maintaining http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html

class ListView extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading: true,
      specimens: [],
      page: 0,
      pages: 0,
      limit: 10
    };
    this.__search( {} );
  }

  search ( query ) {
    if ( this.state.loading ) {
      return;
    }
    this.setState( { loading: true } );
    this.__search( query );
  }

  __search ( query ) {
    API.specimen.list( {
      limit: this.state.limit,
      offset: this.state.page * this.state.limit,
      specimen: query
    }, ( err, result ) => {
      this.setState( { loading: false } );

      if ( err ) {
        return alert( err.message );
      }

      this.setState( {
        specimens: result.specimens.map( s => <Specimen key={s._id} spec={s} edit={this.edit.bind( this )}/> ),
        page: Math.floor( result.offset / result.limit ),
        pages: Math.floor( result.total / result.limit )
      } );
    } );
  }

  edit ( ...spec ) {
    this.props.goEdit( ...spec );
  }

  first () {
    this.setState( { page: 0 } );
    setTimeout( this.search.bind( this ), 0 );
  }

  last () {
    this.setState( { page: this.state.pages } );
    setTimeout( this.search.bind( this ), 0 );
  }

  next () {
    if ( this.state.page < this.state.pages ) {
      this.setState( { page: this.state.page + 1 } );
      setTimeout( this.search.bind( this ), 0 );
    }
  }

  previous () {
    if ( this.state.page > 0 ) {
      this.setState( { page: this.state.page - 1 } );
      setTimeout( this.search.bind( this ), 0 );
    }
  }

  render () {
    return (
      <div>
        <SearchCriteria search={this.search.bind( this )}/>
        <div style={{ padding: 8 }}>
          {this.state.specimens}
        </div>
        <div style={{ padding: 8 }}>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.first.bind( this )}>&lt;&lt;</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.previous.bind( this )}>&lt;</button>
          <span style={{ 'marginRight': 8 }}>{this.state.page + 1} of {this.state.pages + 1}</span>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.next.bind( this )}>&gt;</button>
          <button style={{ 'marginRight': 8 }} type="button" onClick={this.last.bind( this )}>&gt;&gt;</button>
          <a target="_blank" href="/api/v0/specimen/download/json">
            <button style={{ 'marginRight': 8 }} type="button">Download JSON</button>
          </a>
          <a target="_blank" href="/api/v0/specimen/download/csv">
            <button type="button">Download CSV</button>
          </a>
        </div>
      </div>
    );
  }
}
