import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import MainMap from './components/mainmap.js'
import MyLeafs from './components/myleaf.js'
import Firebaselogin from './components/firebaselogin.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginopen: false,
    };
  }

  openlogin = () => {
    this.setState({loginopen: true})
    
  }

  closelogin = () => {
    this.setState({loginopen: false})
  }

  render() {
    return (
      <BrowserRouter>
          <div className="App">
            <div className="navbar">
              <div className="navcontainer">
                <Link  to="/"><h1 >Leafnet </h1></Link>
                <span className="filler"/>
                {this.props.isloggedin ? (<RaisedButton label="Logout" secondary={true} onClick={this.openlogin} />)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
            </div>

            <Dialog modal={false} open={this.state.loginopen} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin/>
            </Dialog>

            <Route exact path={"/"} component={() => <MainMap/>}/>
            <Route exact path={"/"} component={() => <MyLeafs/>}/>
          </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        isloggedin: state.user.isloggedin,
    };
}

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
