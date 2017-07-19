import React, { Component } from 'react';
import './App.css';
import Logo from './logo.png'
import firebase from 'firebase';



import Mappy from 'material-ui/svg-icons/action/explore';
import Leafs from 'material-ui/svg-icons/places/spa';
import Usericon from 'material-ui/svg-icons/action/account-box'
import Dialog from 'material-ui/Dialog';
import { red500,green500,blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

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
                            globalvalue: marks[mark].global,
                            commentcount: marks[mark].commentcount,
                            upvotes: marks[mark].upvotes
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
                            userid: marks[mark].userid,
                            commentcount: marks[mark].commentcount,
                            upvotes: marks[mark].upvotes
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
                <img width="100"src={Logo} alt="Leafnet Logo"/>
                <span className="filler"/>
                <IconButton tooltip="My Map">
                  <Leafs color={red500} onClick={this.showusermap} style={style.small} />
                </IconButton>
                <IconButton tooltip="Global Map">
                  <Mappy style={style.small} onClick={this.showglobalmap} color={green500} />
                </IconButton>
                {this.state.isloggedin ? (<IconButton tooltip="My Profile"><Usericon onClick={this.openlogin} color={blue500}/></IconButton>)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
          </div>

          {this.state.showusermap ? (<Map userid={this.state.userid} markers={this.state.markers}/>):(<GlobalMap globalmarkers={this.state.globalmarkers}/>)}

          <Dialog contentClassName="dialogwidth" modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin isloggedin={this.state.isloggedin} markers={this.state.markers} userid={this.state.userid}/>
          </Dialog>
        </div>
    );
  }
}

const style = {
  small: {
    width: 50,
    height: 50,
    padding: 10,
  }
};
export default App;
