import React from 'react'
import {connect} from 'react-redux';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

import { addmarker } from '../actions/userActions';

const params = {v: '3.exp', key: ''};

class MainMap extends React.Component {


  handleMapClick = (event) => {
    const marker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    this.props.addmarker(marker)
  }


  render() {
    return (
        <Gmaps
          width={'800px'}
          height={'600px'}
          lat={51.418981}
          lng={-0.166303}
          zoom={12}
          loadingMessage={'Be happy'}
          params={params}
          onMapCreated={this.onMapCreated}
          onClick={this.handleMapClick}>
          {this.props.markerlist.map((marker, index) =>(
                <Marker
                  key={index}
                  lat={marker.latitude}
                  lng={marker.longitude}
                  draggable={true}
                  onDragEnd={this.onDragEnd} />
            ))}
        </Gmaps>
        
    );
  }
}

const mapStateToProps = (state) => {
    return {
      markerlist: state.user.markerlist
    };
}

const mapDispatchToProps = dispatch => ({
    addmarker: marker => dispatch(addmarker(marker)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainMap);

