import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';



import Mappy from 'material-ui/svg-icons/action/explore';
import Leafs from 'material-ui/svg-icons/places/spa';
import Dialog from 'material-ui/Dialog';
import { red500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

import Firebaselogin from './components/firebaselogin'
import Map from './components/map.js'
import GlobalMap from './components/globalmap.js'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggedin: false,
      openlogin: false,
      markers: [],
      globalmarkers: [],
      userid: "",
      showusermap: false

    };
  }
  componentDidMount(){
    this.getmarkers()
    this.getglobalmarkers()
  }

  getmarkers = () => {
  firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
            this.setState({isloggedin: true, userid: user.email})
            firebase.database().ref('users').child(user.uid).child('markers').on('value', snap =>{
                
                if (snap.val()) {
                    let marks = snap.val();
                    let markerlist = [];
                    for (let mark in marks) {
                        markerlist.push({
                            postkey: mark,
                            latitude: marks[mark].latitude,
                            longitude: marks[mark].longitude,
                            title: marks[mark].title,
                            globalvalue: marks[mark].global
                        })
                        this.setState({markers: markerlist})
                    }
                } else {
                  this.setState({markers: []})
                }
            });
        } else {
          this.setState({isloggedin: false, markers: [], userid: ""})
        }
    })
  }
  getglobalmarkers = () => {
    firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
           
            firebase.database().ref('global').child('markers').on('value', snap =>{
                
                if (snap.val()) {
                    let marks = snap.val();
                    let markerlist = [];
                    for (let mark in marks) {
                        markerlist.push({
                            feedkey: mark,
                            latitude: marks[mark].latitude,
                            longitude: marks[mark].longitude,
                            title: marks[mark].title,
                            userid: marks[mark].userid
                        })
                        this.setState({globalmarkers: markerlist})
                    }
                } 
            });
        } else {
          this.setState({globalmarkers: []})
        }
    })
  }
  showusermap = () => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        this.setState({showusermap: true})
  }}
  showglobalmap = () => {
    this.setState({showusermap: false})
  }

  openlogin = () => {this.setState({openlogin: true})}

  closelogin = () => {
    this.setState({openlogin: false})
  }

  render() {
    return (
        <div className="App">
          <div className="navbar">
              <div className="navcontainer">
                <span className="title">Leafnet </span>
                <span className="filler"/>
                <Leafs color={red500} onClick={this.showusermap} style={style.small} />
                <Mappy style={style.small} onClick={this.showglobalmap} color={blue500} />
                {this.state.isloggedin ? (<RaisedButton label="Profile" secondary={true} onClick={this.openlogin} />)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
          </div>

          {this.state.showusermap ? (<Map userid={this.state.userid} markers={this.state.markers}/>):(<GlobalMap globalmarkers={this.state.globalmarkers}/>)}

          <Dialog modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin isloggedin={this.state.isloggedin} markers={this.state.markers} userid={this.state.userid}/>
          </Dialog>
        </div>
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
