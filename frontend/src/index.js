import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as models from './store/models';
import { init } from '@rematch/core';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const store = init({ models }); // Creates a redux store without the boilerplate

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
