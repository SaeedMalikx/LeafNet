import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom'



import MainMap from './components/mainmap.js'
import MyLeafs from './components/myleafs.js'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <div className="App">
            <div className="navbar">
              <div className="navcontainer">
                <Link  to="/"><h1 >Leafnet </h1></Link>
                <span className="filler"/>
              </div>
            </div>

            <Route exact path={"/"} component={() => <MainMap/>}/>
            <Route exact path={"/"} component={() => <MainMap/>}/>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
