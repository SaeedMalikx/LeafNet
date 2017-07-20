import React, { Component } from 'react';
import './App.css';
import Logo from './logo.png'
import firebase from 'firebase';
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'



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
      userid: "",

    };
  }
  componentDidMount(){
    this.getmarkers()
  }

  getmarkers = () => {
  firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
            this.setState({isloggedin: true, userid: user.email})       
        } else {
          this.setState({isloggedin: false, userid: ""})
        }
    })
  }
 
  openlogin = () => {this.setState({openlogin: true})}

  closelogin = () => {
    this.setState({openlogin: false})
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="navbar">
              <div className="navcontainer">
                <img width="100"src={Logo} alt="Leafnet Logo"/>
                <span className="filler"/>
                <Link to="/mymap"><IconButton tooltip="My Map">
                  <Leafs color={red500} onClick={this.showusermap} style={style.small} />
                </IconButton></Link>
                <Link to="/"> <IconButton tooltip="Global Map">
                 <Mappy style={style.small} onClick={this.showglobalmap} color={green500} />
                </IconButton></Link>
                {this.state.isloggedin ? (<IconButton tooltip="My Profile"><Usericon onClick={this.openlogin} color={blue500}/></IconButton>)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
          </div>

          
          <Route exact path={"/mymap"} component={() => <Map userid={this.state.userid}/>}/>
          <Route exact path={"/"} component={() => <GlobalMap />}/>
          <Dialog contentClassName="dialogwidth" modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin isloggedin={this.state.isloggedin} markers={this.state.markers} userid={this.state.userid}/>
          </Dialog>
        </div>
      </BrowserRouter>
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
