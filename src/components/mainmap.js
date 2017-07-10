import React from 'react'
import GoogleMapReact from 'google-map-react';
import './mainmap.css'


let defaultProps = {
    center: {lat: 40.73, lng: -73.99},
    zoom: 11
  };


let gapikey = 

class MainMap extends React.Component {


  render() {
    return (
      <div className="mapcon">
        <GoogleMapReact
        bootstrapURLKeys={{
            key: gapikey,
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        >
        
        </GoogleMapReact>
      </div>
    )
  }
}

export default MainMap