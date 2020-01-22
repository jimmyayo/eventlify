import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import {createBrowserHistory} from 'history';
import './app/layout/styles.css';
import App from './app/layout/App';
import ScrollToTop from './app/layout/ScrollToTop';
import * as serviceWorker from './serviceWorker';
import dateFnsLocalizer from 'react-widgets-date-fns';

dateFnsLocalizer();
export const history = createBrowserHistory();

ReactDOM.render(
   <Router history={history}>
      <ScrollToTop />
      <App />
   </Router>

   , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
