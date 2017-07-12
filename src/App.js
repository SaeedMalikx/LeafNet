import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import firebase from 'firebase';
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";



import Mappy from 'material-ui/svg-icons/action/explore';
import Leafs from 'material-ui/svg-icons/places/spa';
import Popcancel from 'material-ui/svg-icons/navigation/cancel'
import Popmore from 'material-ui/svg-icons/navigation/arrow-forward'
import Dialog from 'material-ui/Dialog';
import { red500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

import Firebaselogin from './components/firebaselogin'
import MyLeafs from './components/myleaf.js';

const Map = ReactMapboxGl({
  accessToken: ""
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggedin: false,
      openlogin: false,
      markers: [],
      popuplat: "",
      popuplng: ""

    };
  }
  componentDidMount(){
    this.getmarkers()
  }

  getmarkers = () => {
  firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
            this.setState({isloggedin: true})
            firebase.database().ref('users').child(user.uid).child('markers').on('value', snap =>{
                
                if (snap.val()) {
                    let marks = snap.val();
                    let markerlist = [];
                    for (let mark in marks) {
                        markerlist.push({
                          key: mark,
                            latitude: marks[mark].latitude,
                            longitude: marks[mark].longitude,
                        })
                        this.setState({markers: markerlist})
                    }
                } else {
                } 
            });
        } else {
          this.setState({isloggedin: false, markers: []})
        }
    })
  }

  handleMapClick = (map, evt) => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('users').child(user.uid).child('markers').push({
            'latitude': evt.lngLat.lat,
            'longitude': evt.lngLat.lng
        })
    }
  }
  openlogin = () => {
    this.setState({openlogin: true})
    
  }


  closelogin = () => {
    this.setState({openlogin: false})
  }

  leafclick = (e) => {
    this.setState({popuplat: e.lngLat.lat, popuplng: e.lngLat.lng})
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: ""})
  }
  
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="navbar">
              <div className="navcontainer">
                <NavLink activeClassName="selected" to="/"><span className="title">Leafnet </span></NavLink>
                <span className="filler"/>
                <Link to="/myleafs"><Leafs color={red500} style={style.small} /></Link>
                <Mappy style={style.small} onClick={this.opennewcard} color={blue500} />
                {this.state.isloggedin ? (<RaisedButton label="Profile" secondary={true} onClick={this.openlogin} />)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
          </div>
           <Map
              style="mapbox://styles/mapbox/light-v9"
              onDblClick={this.handleMapClick}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Layer
                  type="symbol"
                  id="marker"
                  layout={{ "icon-image": "square-15" }}>
                  {this.state.markers.map((marker, index)=><Feature 
                                                            key={index} 
                                                            onClick={this.leafclick}
                                                            coordinates={[marker.longitude, marker.latitude]}
                                                            />)}
                </Layer>
                <Popup
                  coordinates={[this.state.popuplng,this.state.popuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <p>Small Note</p>
                  <Popcancel onClick={this.clearpopup}/>
                  <Popmore onClick={this.openleaf}/>
                </Popup>
            </Map>

          <Dialog modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin isloggedin={this.state.isloggedin}/>
          </Dialog>

          <Dialog modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <MyLeafs/>
          </Dialog>

        </div>
      </BrowserRouter>
    );
  }
}






const style = {
  small: {
    width: 35,
    height: 35,
    padding: 10,
  }
};
export default App;
