import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';

import store from './store';




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
<Provider store={store}>
    <Root/>
</Provider>

,document.getElementById('root'));
registerServiceWorker();
