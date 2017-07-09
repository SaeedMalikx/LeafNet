import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom'



import MainMap from './components/mainmap.js'
import MyLeafs from './components/myleaf.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginopen: false,
    };
  }
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
            <Route exact path={"/"} component={() => <MyLeafs/>}/>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
