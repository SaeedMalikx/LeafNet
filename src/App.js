import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'


import Firebaselogin from './components/firebaselogin'


import { refresh } from './actions/userActions';

import Mappy from 'material-ui/svg-icons/action/explore';
import Leafs from 'material-ui/svg-icons/places/spa';
import Dialog from 'material-ui/Dialog';
import { red500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';


import MyLeafs from './components/myleaf.js';
import Mainmap from './components/mainmap.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newcardopen: false,
      openlogin: false

    };
  }
  componentDidMount(){
    this.props.refresh()
  }

  openlogin = () => {
    this.setState({openlogin: true})
    
  }


  closelogin = () => {
    this.setState({openlogin: false})
  }

  checkstate = () => {
    console.log(this.props.markerlist)
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
                <Mappy style={style.small} onClick={this.checkstate} />
                {this.props.isloggedin ? (<RaisedButton label="Profile" secondary={true} onClick={this.openlogin} />)
                                       : (<RaisedButton label="Login" secondary={true} onClick={this.openlogin} />)}
              </div>
          </div>

          <Dialog modal={false} open={this.state.openlogin} onRequestClose={this.closelogin} autoDetectWindowHeight={true}>
                <Firebaselogin/>
          </Dialog>

          
          <Route exact path={"/"} component={() => <Mainmap/>}/>
          <Route exact path={"/myleafs"} component={() => <MyLeafs/>}/>
        </div>
      </BrowserRouter>
    );
  }
}



const mapStateToProps = (state) => {
    return {
        isloggedin: state.user.isloggedin,
        markerlist: state.user.markerlist
    };
}

const mapDispatchToProps = dispatch => ({
  refresh: () => dispatch(refresh())
});


const style = {
  small: {
    width: 35,
    height: 35,
    padding: 10,
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
