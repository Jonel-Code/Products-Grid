import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';

// disable console logs on production
if (process.env.NODE_ENV === 'production') {
  console.log = () => { };
}
// initialize app on root element
ReactDom.render(<App />, document.getElementById('root'));
