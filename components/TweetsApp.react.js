
var React = require('react');
var Tweets = require('./Tweets.react.js');
var Loader = require('./Loader.react.js');
var NotificationBar = require('./NotificationBar.react.js');

// Export TweetsApp components
module.exports = TweetsApp = React.createClass({

  addTweet: function(tweet){
    var updated = this.state.tweets;
    var count = this.state.count + 1;
    var skip = this.state.skip + 1;

    updated.unshift(tweet);
    this.setState({tweets: updated, count: count, skip: skip});

  },

  // JSON Server Access
  getPage: function(page){

    var request = new XMLHttpRequest(), self = this;
    request.open('GET', 'page/' + page + "/" + this.state.skip, true);
    request.onload = function() {


      if (request.status >= 200 && request.status < 400){

        self.loadPagedTweets(JSON.parse(request.responseText));
      } else {
        self.setState({paging: false, done: true});
      }
    };

    request.send();

  },

  // display unread tweets
  showNewTweets: function(){

    var updated = this.state.tweets;
    updated.forEach(function(tweet){
      tweet.active = true;
    });

    this.setState({tweets: updated, count: 0});

  },

  // Load tweets from the server
  loadPagedTweets: function(tweets){

    var self = this;
    if(tweets.length > 0) {
      var updated = this.state.tweets;
      tweets.forEach(function(tweet){
        updated.push(tweet);
      });

      setTimeout(function(){

        self.setState({tweets: updated, paging: false});

      }, 1000);

    } else {
      this.setState({done: true, paging: false});
    }
  },

  // use scroll position to check if load new tweets
  checkWindowScroll: function(){

    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = document.body.scrollTop;
    var scrolled = (h + s) > document.body.offsetHeight;

    if(scrolled && !this.state.paging && !this.state.done) {
      this.setState({paging: true, page: this.state.page + 1});
      this.getPage(this.state.page);
    }
  },

  // initial component state
  getInitialState: function(props){

    props = props || this.props;

    return {
      tweets: props.tweets,
      count: 0,
      page: 0,
      paging: false,
      skip: 0,
      done: false
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },


  componentDidMount: function(){

    var self = this;
    var socket = io.connect();

    socket.on('tweet', function (data) {
        self.addTweet(data);
    });

    window.addEventListener('scroll', this.checkWindowScroll);

  },

  // Render component
  render: function(){

    return (
      <div className="tweets-app">
        <Tweets tweets={this.state.tweets} />
        <Loader paging={this.state.paging}/>
        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets}/>
      </div>
    )

  }

});
