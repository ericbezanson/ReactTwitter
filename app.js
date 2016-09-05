/** @jsx React.DOM */

var React = require('react');
var TweetsApp = require('./components/TweetsApp.react');

// request initial state from server
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)

// Render from last server state
React.render(
  <TweetsApp tweets={initialState}/>,
  document.getElementById('react-app')
);
