import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';






const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const config = {
  };
firebase.initializeApp(config);

const Root= () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(
    <Root/>

,document.getElementById('root'));
registerServiceWorker();
