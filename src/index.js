import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Router from './router';
import * as serviceWorker from './serviceWorker';
import {firebaseImpl} from './utils/firebaseUtils';
import { Provider } from 'react-redux';
import { store } from './redux/store';

firebaseImpl();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {<Router/>}      
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
