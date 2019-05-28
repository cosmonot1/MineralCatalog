import React from 'react';
import Moment from 'moment';
import { GCS_IMAGE_LINK } from './utils.js';
import DatePicker from 'react-date-picker';

class Specimen extends React.Component {
  constructor ( props ) {
    super( props );
  }

  edit ( e ) {
    this.props.edit( this.props.spec, e.target.name );
  }

  render () {
    return (
      <div>
        <table style={{ padding: 8, display: 'inline-block' }}>
          <tbody>
            <tr>
              <th>Main Photo</th>
            </tr>
            <tr>
              <td>
                <div style={{ height: 100, width: 100 }}>
                  <img src={GCS_IMAGE_LINK + this.props.spec.photos.main}
                       alt={this.props.spec.photos.main}
                       height="100"
                       width="100"/>
                </div>
              </td>
            </tr>
            <tr>
              <td>Catalog: {( "00000" + this.props.spec.catalog_number ).substr( -5, 5 )}</td>
            </tr>
            <tr>
              <td>
                <button type="button" name="edit" onClick={this.edit.bind( this )}>Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" name="duplicate" onClick={this.edit.bind( this )}>Duplicate</button>
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{ padding: 8, display: 'inline-block' }}>
          <tbody>
            <tr>
              <th style={{ 'paddingRight': 8 }}>Physical Dimensions</th>
              <th style={{ 'paddingRight': 8 }}>Species</th>
              <th style={{ 'paddingRight': 8 }}>Discovery Location</th>
              <th style={{ 'paddingRight': 8 }}>Analysis</th>
              <th style={{ 'paddingRight': 8 }}>Acquired</th>
              <th style={{ 'paddingRight': 8 }}>States</th>
              <th style={{ 'paddingRight': 8 }}>Storage Location</th>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Weight: {this.props.spec.physical_dimensions.weight} (g)</td>
              <td style={{ 'paddingRight': 8 }}>Main: {this.props.spec.species.main}</td>
              <td style={{ 'paddingRight': 8 }}>Stope: {this.props.spec.discovery_location.stope}</td>
              <td style={{ 'paddingRight': 8 }}>Analyzed: <input type="checkbox" name="checked"
                                                                 readOnly
                                                                 checked={this.props.spec.analysis.analyzed}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Date: {Moment(this.props.spec.acquired.date).format('DD-MM-YYYY')}</td>
              <td style={{ 'paddingRight': 8 }}>Old Label: <input type="checkbox" name="checked"
                                                                  readOnly
                                                                  checked={this.props.spec.states.old_label}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Exhibit: <input type="checkbox" name="checked"
                                                                readOnly
                                                                checked={this.props.spec.storage_location.exhibit}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Length: {this.props.spec.physical_dimensions.length} (cm)</td>
              <td
                style={{ 'paddingRight': 8 }}>Additional: {this.props.spec.species.additional.reduce( ( acc, val ) => acc + ' ' + val.modifier + ' ' + val.species, '' )}</td>
              <td style={{ 'paddingRight': 8 }}>Level: {this.props.spec.discovery_location.level}</td>
              <td style={{ 'paddingRight': 8 }}>By: {this.props.spec.analysis.by}</td>
              <td style={{ 'paddingRight': 8 }}>Paid: {this.props.spec.acquired.paid} ($)</td>
              <td style={{ 'paddingRight': 8 }}>Repair: <input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.states.repair}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Inside: <input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.storage_location.inside}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Width: {this.props.spec.physical_dimensions.width} (cm)</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Mine: {this.props.spec.discovery_location.mine}</td>
              <td style={{ 'paddingRight': 8 }}>Method: {this.props.spec.analysis.method}</td>
              <td style={{ 'paddingRight': 8 }}>From: {this.props.spec.acquired.from}</td>
              <td style={{ 'paddingRight': 8 }}>Story: <input type="checkbox" name="checked"
                                                              readOnly
                                                              checked={this.props.spec.states.story}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Outside:<input type="checkbox" name="checked"
                                                               readOnly
                                                               checked={this.props.spec.storage_location.outside}/></td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Height: {this.props.spec.physical_dimensions.height} (cm)</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>District: {this.props.spec.discovery_location.district}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Where: {this.props.spec.acquired.where}</td>
              <td style={{ 'paddingRight': 8 }}>Figured: <input type="checkbox" name="checked"
                                                                readOnly
                                                                checked={this.props.spec.states.figured}/>
              </td>
              <td style={{ 'paddingRight': 8 }}>Loan: <input type="checkbox" name="checked"
                                                             readOnly
                                                             checked={this.props.spec.storage_location.loan}/>
              </td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}>Main Crystal: {this.props.spec.physical_dimensions.main_crystal} (cm)
              </td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>State: {this.props.spec.discovery_location.state}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Details: {this.props.spec.storage_location.details}</td>
            </tr>
            <tr>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}>Country: {this.props.spec.discovery_location.country}</td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
              <td style={{ 'paddingRight': 8 }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Specimen;
