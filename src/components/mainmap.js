import React from 'react'
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import firebase from 'firebase';


const params = {v: '3.exp', key: 'AIzaSyC07RdgEE83owZKfEJN_6WsS6J64R9UnLo'};

export default class MainMap extends React.Component {

  

  handleMapClick = (event) => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('users').child(user.uid).child('markers').push({
            'latitude': event.latLng.lat(),
            'longitude': event.latLng.lng()
        })
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.center === nextProps.center){
      return false
    }else{
      return true
    }
  }

  render() {
    return (
        <div>
        <Gmaps
          width={'100%'}
          height={'600px'}
          lat={51.418981}
          lng={-0.166303}
          zoom={12}
          loadingMessage={'Be happy'}
          params={params}
          onMapCreated={this.onMapCreated}
          onClick={this.handleMapClick}>
          {this.props.markers.map((marker, index) =>
                <Marker
                  key={index}
                  lat={marker.latitude}
                  lng={marker.longitude}
                  draggable={true}
                  onDragEnd={this.onDragEnd} />
            )}
        </Gmaps>
        </div>
    );
  }
}


